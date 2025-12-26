"""
UTech Campus Navigation System - Tree Editor
Features: Search (F), Multi-Select (Space), Multi-Delete (D), Undo (U)
"""

import os
import json
import copy
import re
from typing import List, Dict, Optional, Tuple
from dataclasses import dataclass, field
from enum import Enum


class NodeType(Enum):
    ROOT = "root"
    BUILDING = "building"
    FLOOR = "floor"
    ROOM = "room"
    GATE = "gate"


@dataclass
class TreeNode:
    name: str
    worded_direction: str
    node_type: NodeType
    parent: Optional['TreeNode'] = None
    children: List['TreeNode'] = field(default_factory=list)
    
    def add_child(self, child: 'TreeNode'):
        self.children.append(child)
        child.parent = self
    
    def remove_child(self, child: 'TreeNode'):
        if child in self.children:
            self.children.remove(child)
            child.parent = None
    
    def to_dict(self) -> Dict:
        return {
            'name': self.name,
            'worded_direction': self.worded_direction,
            'type': self.node_type.value,
            'children': [child.to_dict() for child in self.children]
        }


class TreeDatabase:
    def __init__(self):
        self.root = TreeNode('root', 'Starting point', NodeType.ROOT)
        self.load_sample_data()
    
    def load_sample_data(self):
        building1 = TreeNode('building1', 'Go to Engineering Building (Building 1)', NodeType.BUILDING)
        self.root.add_child(building1)
        
        floor1ground = TreeNode('floor1ground', 'Go to Ground Floor', NodeType.FLOOR)
        building1.add_child(floor1ground)
        
        for room_name, direction in [('1a37', 'Go to room 1A37'), ('1a36', 'Go to room 1A36')]:
            room_node = TreeNode(room_name, direction, NodeType.ROOM)
            floor1ground.add_child(room_node)
        
        main_gate = TreeNode('main gate', 'Start at Main Gate', NodeType.GATE)
        self.root.add_child(main_gate)

    def get_buildings(self) -> List[TreeNode]:
        return [c for c in self.root.children if c.node_type == NodeType.BUILDING]
    
    def get_gates(self) -> List[TreeNode]:
        return [c for c in self.root.children if c.node_type == NodeType.GATE]
    
    def to_dict(self) -> Dict:
        return self.root.to_dict()


class MenuState(Enum):
    BUILDINGS = "buildings"
    FLOORS = "floors"
    ROOMS = "rooms"


class UTechTreeEditor:
    def __init__(self):
        self.db = TreeDatabase()
        self.state = MenuState.BUILDINGS
        self.current_node: Optional[TreeNode] = None
        self.selected_index = 0
        self.running = True
        
        # Multi-select
        self.selected_indices: set[int] = set()
        
        # Search
        self.search_mode = False
        self.search_query = ""
        
        # Undo
        self.history = []
        self.history_index = -1
        self.max_history = 50
        self.last_action_desc = ""
        self.save_state("Initial state")
        
        # Colors
        self.HEADER = '\033[95m'
        self.OKBLUE = '\033[94m'
        self.OKGREEN = '\033[92m'
        self.OKYELLOW = '\033[93m'
        self.FAIL = '\033[91m'
        self.ENDC = '\033[0m'
        self.BOLD = '\033[1m'
    
    def clear_screen(self):
        os.system('cls' if os.name == 'nt' else 'clear')
    
    def print_header(self, text: str):
        print(f"\n{self.HEADER}{self.BOLD}{'=' * 60}{self.ENDC}")
        print(f"{self.HEADER}{self.BOLD}{text.center(60)}{self.ENDC}")
        print(f"{self.HEADER}{self.BOLD}{'=' * 60}{self.ENDC}\n")
    
    def print_info(self, text: str):
        print(f"{self.OKBLUE}{text}{self.ENDC}")
    
    def print_success(self, text: str):
        print(f"{self.OKGREEN}✓ {text}{self.ENDC}")
    
    def print_error(self, text: str):
        print(f"{self.FAIL}✗ {text}{self.ENDC}")
    
    def get_current_items(self) -> List[TreeNode]:
        if self.state == MenuState.BUILDINGS:
            return self.db.get_buildings() + self.db.get_gates()
        elif self.current_node:
            return self.current_node.children
        return []
    
    def get_filtered_items(self) -> List[Tuple[int, TreeNode]]:
        """Returns list of (original_index, node) — filtered by search if active"""
        items = self.get_current_items()
        if not self.search_mode or not self.search_query.strip():
            return [(i, item) for i, item in enumerate(items)]
        
        query = self.search_query.lower().strip()
        matches = []
        for i, item in enumerate(items):
            if (query in item.name.lower() or 
                query in item.worded_direction.lower()):
                matches.append((i, item))
        return matches
    
    def display_menu(self):
        self.clear_screen()
        
        undo_status = "available" if self.history_index > 0 else "none"

        # Safe header text
        if self.state == MenuState.BUILDINGS:
            header_text = "🏢 UTech Campus Buildings & Gates"
        elif self.state == MenuState.FLOORS:
            name = self.current_node.name if self.current_node else "Unknown Building"
            header_text = f"📁 Floors in {name}"
        else:  # ROOMS
            name = self.current_node.name if self.current_node else "Unknown Floor"
            header_text = f"🚪 Rooms in {name}"
        
        self.print_header(header_text)

        # Controls info
        controls = [
            "↑↓ Navigate", "Space: Select", "Enter: Open/Add", "A: Add", 
            "D: Delete selected", "R: Rename", "Shift+R: Direction", 
            f"U: Undo ({undo_status})", "F: Search", "ESC: Back/Clear search"
        ]
        self.print_info(" | ".join(controls))
        
        print()
        filtered = self.get_filtered_items()
        all_items = self.get_current_items()
        
        # Search status
        if self.search_mode:
            count = len(filtered)
            print(f"{self.OKYELLOW}🔍 Search: '{self.search_query}' → {count} match{'es' if count != 1 else ''}{self.ENDC}\n")
        
        # Display filtered items
        for disp_idx, (orig_idx, item) in enumerate(filtered):
            prefix = "→ " if disp_idx == self.selected_index else "  "
            mark = "[✓]" if orig_idx in self.selected_indices else "   "
            icon = {NodeType.GATE: "🚪", NodeType.BUILDING: "🏢", NodeType.FLOOR: "📁"}.get(item.node_type, "🚪")
            color = self.OKGREEN if disp_idx == self.selected_index else self.OKYELLOW
            print(f"{mark}{prefix}{color}{icon} {item.name}{self.ENDC}")
            if disp_idx == self.selected_index:
                print(f"    Direction: {item.worded_direction}")
        
        if self.search_mode and len(filtered) < len(all_items):
            print(f"\n{self.OKBLUE}( {len(all_items) - len(filtered)} items hidden ){self.ENDC}")
        
        print()
        extra_start = len(filtered)
        if self.state == MenuState.BUILDINGS:
            options = ["[A] Add Building", "[G] Add Gate", "[I] Import", "[S] Save & Export", "[Q] Quit"]
            for i, opt in enumerate(options):
                prefix = "→ " if self.selected_index == extra_start + i else "  "
                print(f"  {prefix}{self.OKBLUE}{opt}{self.ENDC}")
        else:
            prefix_add = "→ " if self.selected_index == extra_start else "  "
            print(f"  {prefix_add}{self.OKBLUE}[A] Add {self.state.value[:-1].title()}{self.ENDC}")
            prefix_back = "→ " if self.selected_index == extra_start + 1 else "  "
            print(f"  {prefix_back}{self.OKBLUE}[ESC] Go Back{self.ENDC}")
        
        if self.selected_indices:
            print(f"\n{self.OKYELLOW}Selected: {len(self.selected_indices)} item(s){self.ENDC}")
        
        if self.last_action_desc:
            if self.last_action_desc == "undo":
                print(f"\n{self.OKGREEN}↶ Undo successful{self.ENDC}")
            else:
                print(f"\n{self.OKBLUE}Last: {self.last_action_desc}{self.ENDC}")

    def handle_input(self):
        import sys, tty, termios
        fd = sys.stdin.fileno()
        old = termios.tcgetattr(fd)
        try:
            tty.setraw(sys.stdin.fileno())
            ch = sys.stdin.read(1)
            if ch == '\x1b':
                seq = sys.stdin.read(2)
                if seq == '[A': return 'up'
                if seq == '[B': return 'down'
                return 'escape'
            return ch.lower() if ch.isalpha() else ch
        finally:
            termios.tcsetattr(fd, termios.TCSADRAIN, old)
    
    def navigate_up(self):
        total = len(self.get_filtered_items())
        extra = 5 if self.state == MenuState.BUILDINGS else 2
        if self.selected_index > 0:
            self.selected_index -= 1

    def navigate_down(self):
        total = len(self.get_filtered_items())
        extra = 5 if self.state == MenuState.BUILDINGS else 2
        if self.selected_index < total + extra - 1:
            self.selected_index += 1

    def handle_enter(self):
        filtered = self.get_filtered_items()
        items = self.get_current_items()
        if self.selected_index < len(filtered):
            orig_idx = filtered[self.selected_index][0]
            node = items[orig_idx]
            if self.state == MenuState.BUILDINGS and node.node_type == NodeType.BUILDING:
                self.current_node = node
                self.state = MenuState.FLOORS
            elif self.state == MenuState.FLOORS:
                self.current_node = node
                self.state = MenuState.ROOMS
            self.reset_view()
        else:
            offset = self.selected_index - len(filtered)
            if self.state == MenuState.BUILDINGS:
                {"0": self.add_building, "1": self.add_gate, "2": self.perform_import,
                 "3": self.save_and_export, "4": lambda: setattr(self, 'running', False)}[str(offset)]()
            else:
                if offset == 0:
                    self.add_floor() if self.state == MenuState.FLOORS else self.add_room()
                elif offset == 1:
                    self.go_back()

    def reset_view(self):
        self.selected_index = 0
        self.selected_indices.clear()
        self.search_mode = False
        self.search_query = ""

    def go_back(self):
        if self.state == MenuState.ROOMS and self.current_node:
            self.current_node = self.current_node.parent
            self.state = MenuState.FLOORS
        elif self.state == MenuState.FLOORS:
            self.current_node = None
            self.state = MenuState.BUILDINGS
        self.reset_view()

    def toggle_selection(self):
        filtered = self.get_filtered_items()
        if self.selected_index < len(filtered):
            orig_idx = filtered[self.selected_index][0]
            if orig_idx in self.selected_indices:
                self.selected_indices.remove(orig_idx)
            else:
                self.selected_indices.add(orig_idx)

    def delete_selected(self):
        if not self.selected_indices:
            self.print_error("No items selected for deletion")
            input("Press Enter to continue...")
            return
        
        items = self.get_current_items()
        to_delete = [items[i] for i in sorted(self.selected_indices)]
        names = ", ".join(n.name for n in to_delete)
        
        confirm = input(f"{self.FAIL}Delete {len(to_delete)} items: {names}? (y/N): {self.ENDC}").strip().lower()
        if confirm != 'y':
            return
        
        self.save_state(f"delete {len(to_delete)} items")
        for node in to_delete:
            if node.parent:
                node.parent.remove_child(node)
            else:
                self.db.root.remove_child(node)
        self.selected_indices.clear()
        self.last_action_desc = f"deleted {len(to_delete)} items"

    def enter_search(self):
        self.search_mode = True
        self.selected_index = 0
        print(f"{self.OKYELLOW}🔍 Enter search term (Enter=apply, ESC=cancel):{self.ENDC}")
        query = input("> ").strip()
        self.search_query = query
        if not query:
            self.search_mode = False

    def add_building(self):
        name = input("Building name: ").strip()
        direction = input("Worded direction: ").strip()
        if name and direction:
            self.db.root.add_child(TreeNode(name, direction, NodeType.BUILDING))
            self.save_state(f"add building '{name}'")

    def add_gate(self):
        name = input("Gate name: ").strip()
        direction = input("Worded direction: ").strip()
        if name and direction:
            self.db.root.add_child(TreeNode(name, direction, NodeType.GATE))
            self.save_state(f"add gate '{name}'")

    def add_floor(self):
        if not self.current_node: return
        name = input("Floor name: ").strip()
        direction = input("Worded direction: ").strip()
        if name and direction:
            self.current_node.add_child(TreeNode(name, direction, NodeType.FLOOR))
            self.save_state(f"add floor '{name}'")

    def add_room(self):
        if not self.current_node: return
        name = input("Room name: ").strip()
        direction = input("Worded direction: ").strip()
        if name and direction:
            self.current_node.add_child(TreeNode(name, direction, NodeType.ROOM))
            self.save_state(f"add room '{name}'")

    def rename_item(self):
        filtered = self.get_filtered_items()
        items = self.get_current_items()
        if self.selected_index >= len(filtered): return
        orig_idx = filtered[self.selected_index][0]
        node = items[orig_idx]
        old = node.name
        self.save_state(f"rename '{old}'")
        new = input(f"New name for '{old}': ").strip()
        if new:
            node.name = new
            self.last_action_desc = f"renamed '{old}' → '{new}'"

    def rename_direction(self):
        filtered = self.get_filtered_items()
        items = self.get_current_items()
        if self.selected_index >= len(filtered): return
        orig_idx = filtered[self.selected_index][0]
        node = items[orig_idx]
        self.save_state(f"edit direction '{node.name}'")
        new = input(f"New direction for '{node.name}': ").strip()
        if new:
            node.worded_direction = new
            self.last_action_desc = f"updated direction '{node.name}'"

    def save_state(self, desc: str):
        tree_copy = copy.deepcopy(self.db.root.to_dict())
        self.history = self.history[:self.history_index + 1]
        self.history.append((tree_copy, desc))
        if len(self.history) > self.max_history:
            self.history.pop(0)
        self.history_index = len(self.history) - 1
        if desc != "undo":
            self.last_action_desc = desc

    def undo(self):
        if self.history_index > 0:
            self.history_index -= 1
            tree_data, _ = self.history[self.history_index]
            self.db.root = self.rebuild_tree(tree_data)
            self.reset_view()
            self.last_action_desc = "undo"

    def rebuild_tree(self, data: Dict, parent: Optional[TreeNode] = None) -> TreeNode:
        node = TreeNode(data['name'], data['worded_direction'], NodeType(data['type']))
        node.parent = parent
        for child_data in data.get('children', []):
            node.add_child(self.rebuild_tree(child_data, node))
        return node

    def generate_tree_database_js(self) -> str:
        """Generate treeDatabase.js code"""
        code = []
        code.append(
        "/**\n" +
        " * Tree Database\n" +
        "* Creates the tree structure for UTech campus navigation\n" +
        " * Hierarchy: Root -> Building -> Floor -> Room\n" +
        " * \n" +
        " * Tree Node Structure:\n" +
        " * - name: string\n" +
        " * - worded_direction: string\n" +
        " * - parent: t_node\n" +
        " * - children: t_node[]\n" +
        " */\n" +
        "\n" +
        "class TreeNode {\n" +
        "\tconstructor(name, worded_direction, parent = null) {\n" +
        "\t\tthis.name = name;\n" +
        "\t\tthis.worded_direction = worded_direction;\n" +
        "\t\tthis.parent = parent;\n" +
        "\t\tthis.children = [];\n" +
        "\t}\n\n" +

        "\taddChild(childNode) {\n" +
        "\t\tthis.children.push(childNode);\n" +
        "\t\tchildNode.parent = this;\n" +
        "\t}\n" +
        "}\n\n" +
        "class TreeDatabase {\n" +
        "\tconstructor() {\n" +
        "\t\tthis.root = null;\n" +
        "\t\tthis.roomsHashMap = new Map();\n" +
        "\t\tthis.buildTree();\n" +
        "\t}\n\n" +
        "\tbuildTree() {\n"
        "\t\t// Create Root Node\n"
        "\t\tthis.root = new TreeNode('root', 'Starting point');\n\n"
        )

        # Helper to get safe variable name
        def safe_var_name(name: str, node_type: NodeType) -> str:
            if node_type == NodeType.GATE:
                # Gates keep their name, just replace spaces with underscores
                return name.replace(' ', '_')
            if not name.lower().startswith('building'):
                # Add 'building' prefix if it doesn't already start with 'building'
                return f"building{name}"
            return name

        for building in self.db.get_buildings():
            var_name = safe_var_name(building.name, building.node_type)
            code.append(f"\t\t// {var_name}\n")
            code.append(f"\t\tconst {building.name} = new TreeNode('{building.name}', '{building.worded_direction}');\n")
            code.append(f"\t\tthis.root.addChild({building.name});\n\n")
            
            for floor in building.children:
                code.append(f"\t\tconst {floor.name} = new TreeNode('{floor.name}', '{floor.worded_direction}');\n")
                code.append(f"\t\t{building.name}.addChild({floor.name});\n\n")
                
                code.append(f"\t\tconst {floor.name}Rooms = [\n")
                for room in floor.children:
                    code.append(f"\t\t\t['{room.name}', '{room.worded_direction}'],\n")
                code.append("\t\t];\n\n")
                
                code.append(f"\t\t{floor.name}Rooms.forEach(([roomName, direction]) => {{\n")
                code.append(f"\t\t\tconst roomNode = new TreeNode(roomName, direction);\n")
                code.append(f"\t\t\t{floor.name}.addChild(roomNode);\n")
                code.append(f"\t\t\tthis.roomsHashMap.set(roomName.toLowerCase(), roomNode);\n")
                code.append("\t\t});\n\n")


        code.append("\t\t//Gates\n")
        # Add gates
        for gate in self.db.get_gates():
            code.append(f"\t\tconst {gate.name.replace(' ', '_')} = new TreeNode('{gate.name}', '{gate.worded_direction}');\n")
            code.append(f"\t\tthis.root.addChild({gate.name.replace(' ', '_')});\n")
            code.append(f"\t\tthis.roomsHashMap.set('{gate.name}', {gate.name.replace(' ', '_')});\n\n")
        
        code.append(
        "\t}\n\n" +
        "\tgetRoomsHashMap() {\n" +
        "\t\treturn this.roomsHashMap;\n" +
        "\t}\n\n" +
        "\tgetRoot() {\n"+
        "\t\treturn this.root;\n"+
        "\t}\n"+
        "}\n\n"+
        "// Export for use in other modules\n"+
        "if (typeof module !== 'undefined' && module.exports) {\n"+
        "\tmodule.exports = TreeDatabase;\n" +
        "}\n")

        return ''.join(code)

    def import_from_js(self, content: str) -> bool:
        try:
            self.db.root = TreeNode('root', 'Starting point', NodeType.ROOT)
            node_map = {'root': self.db.root}
            last_floor = None
            comment_pat = re.compile(r'^\s*//\s*(.+)$')
            node_pat = re.compile(r"const\s+(\w+)\s*=\s*new\s+TreeNode\s*\(\s*'([^']+)'\s*,\s*'([^']+)'\s*\)")
            add_pat = re.compile(r"(this\.root|\w+)\.addChild\(\s*(\w+)\s*\)")
            room_pat = re.compile(r"\[\s*'([^']+)'\s*,\s*'([^']+)'\s*\]")

            pending_comment = None
            for line in content.splitlines():
                stripped = line.strip()
                if not stripped: continue

                m = comment_pat.match(line)
                if m:
                    pending_comment = m.group(1).strip()
                    continue

                m = node_pat.search(stripped)
                if m:
                    var, name, direction = m.groups()
                    ntype = NodeType.ROOM
                    if pending_comment:
                        lc = pending_comment.lower()
                        if 'floor' in lc: ntype = NodeType.FLOOR
                        elif 'building' in lc: ntype = NodeType.BUILDING
                        elif 'gate' in lc: ntype = NodeType.GATE
                        pending_comment = None
                    if ntype == NodeType.ROOM:
                        if 'gate' in name.lower() or 'gate' in var.lower(): ntype = NodeType.GATE
                        elif 'building' in var.lower(): ntype = NodeType.BUILDING
                        elif 'floor' in var.lower(): ntype = NodeType.FLOOR
                    node_map[var] = TreeNode(name, direction, ntype)
                    continue

                m = add_pat.search(stripped)
                if m:
                    pkey, cvar = m.groups()
                    parent = node_map.get('root' if pkey == 'this.root' else pkey)
                    child = node_map.get(cvar)
                    if parent and child:
                        parent.add_child(child)
                        if child.node_type == NodeType.FLOOR:
                            last_floor = child
                    continue

                if 'forEach' in stripped:
                    last_floor = None
                    continue

                for rname, rdir in room_pat.findall(line):
                    if last_floor:
                        last_floor.add_child(TreeNode(rname, rdir, NodeType.ROOM))
            return True
        except:
            return False

    def perform_import(self):
        import_path = "../storage/treeDatabase.js"
        try:
            with open(import_path, 'r', encoding='utf-8') as f:
                js_content = f.read()
            
            if self.import_from_js(js_content):
                self.print_success("Successfully imported tree structure from treeDatabase.js")
                # Reset view to refresh display
                self.selected_index = 0
                self.selected_indices.clear()
            else:
                self.print_error("Failed to import tree structure")
        except FileNotFoundError:
            self.print_error(f"File not found: {import_path}")
            self.print_info("Make sure you have exported/saved first, or place a valid treeDatabase.js in utech_export/")
        except Exception as e:
            self.print_error(f"Error reading file: {str(e)}")
        
        #input("Press Enter to continue...")

    def save_and_export(self):
        self.clear_screen()
        self.print_header("💾 Save & Export")
        
        output_dir = "../storage"
        template_output_dir = "./templates"
        os.makedirs(output_dir, exist_ok=True)
        
        # Generate and save treeDatabase.js
        tree_code = self.generate_tree_database_js()
        with open(f"{output_dir}/treeDatabase.js", 'w') as f:
            f.write(tree_code)
        self.print_success(f"Generated {output_dir}/treeDatabase.js")
        
        # Save JSON structure
        with open(f"{template_output_dir}/structure.json", 'w') as f:
            json.dump(self.db.to_dict(), f, indent=2)
        self.print_success(f"Generated {template_output_dir}/structure.json")
        
        # Generate template files
        self.generate_template_files(template_output_dir)
        
        print(f"\n{self.OKGREEN}All files exported to '{output_dir}/' directory{self.ENDC}")
        print(f"\nGenerated files:")
        print(f"  - treeDatabase.js (ready to use)")
        print(f"  - structure.json (tree structure)")
        print(f"  - graphDatabase_template.js (template)")
        print(f"  - buildingPictures_template.js (template)")
        print(f"  - floorPictures_template.js (template)")
        print(f"  - pathDrawer_template.js (template)")
        
        input("\nPress Enter to continue...")


    def generate_template_files(self, output_dir: str):
        """Generate template files for other components"""
        
        # graphDatabase.js template
        graph_template = "// TODO: Add graph nodes with coordinates for each building\n"
        graph_template += "// Example:\n"
        for building in self.db.get_buildings():
            graph_template += f"// const {building.name}_node = new GraphNode('{building.name}', 'building', x, y);\n"
        
        with open(f"{output_dir}/graphDatabase_template.js", 'w') as f:
            f.write(graph_template)
        
        # buildingPictures template
        pics_template = "// Add to buildingPicturesOutput.js\n"
        pics_template += "const buildingPictures = {\n"
        for building in self.db.get_buildings():
            pics_template += f"    '{building.name}': 'assets/buildings/{building.name}.jpg',\n"
        for gate in self.db.get_gates():
            pics_template += f"    '{gate.name}': 'assets/buildings/{gate.name.replace(' ', '_')}.jpg',\n"
        pics_template += "};\n"
        
        with open(f"{output_dir}/buildingPictures_template.js", 'w') as f:
            f.write(pics_template)
        
        # floorPictures template
        floor_pics = "// Add to floorPicturesOutput.js\n"
        floor_pics += "const floorPictures = {\n"
        for building in self.db.get_buildings():
            for floor in building.children:
                floor_pics += f"    '{floor.name}': 'assets/floors/{floor.name}.jpg',\n"
        floor_pics += "};\n"
        
        with open(f"{output_dir}/floorPictures_template.js", 'w') as f:
            f.write(floor_pics)
        
        # pathDrawer template
        vertices_template = "// Add to pathDrawer.js buildingVerticesHashMap\n"
        for building in self.db.get_buildings():
            vertices_template += f"['{building.name}', [\n"
            vertices_template += "    // TODO: Add vertices {x: , y: }\n"
            vertices_template += "]],\n"
        
        with open(f"{output_dir}/pathDrawer_template.js", 'w') as f:
            f.write(vertices_template)


    def run(self):
        while self.running:
            self.display_menu()
            try:
                key = self.handle_input()
                if key == 'up':
                    self.navigate_up()
                elif key == 'down':
                    self.navigate_down()
                elif key in ('\r', '\n'):
                    self.handle_enter()
                elif key in ('escape', '\x7f'):
                    if self.search_mode:
                        self.search_mode = False
                        self.search_query = ""
                    elif self.state != MenuState.BUILDINGS:
                        self.go_back()
                elif key == ' ':
                    self.toggle_selection()
                elif key == 'd':
                    self.delete_selected()
                elif key == 'f':
                    self.enter_search()
                elif key == 'a':
                    if self.state == MenuState.BUILDINGS: self.add_building()
                    elif self.state == MenuState.FLOORS: self.add_floor()
                    else: self.add_room()
                elif key == 'g' and self.state == MenuState.BUILDINGS:
                    self.add_gate()
                elif key == 'i' and self.state == MenuState.BUILDINGS:
                    self.perform_import()
                elif key == 's' and self.state == MenuState.BUILDINGS:
                    self.save_and_export()
                elif key == 'q' and self.state == MenuState.BUILDINGS:
                    self.running = False
                elif key == 'r':
                    self.rename_item()
                elif key == 'e':
                    self.rename_direction()
                elif key == 'u':
                    self.undo()
            except KeyboardInterrupt:
                self.running = False
            except Exception as e:
                self.print_error(f"Error: {e}")
                input("Press Enter...")

        self.clear_screen()
        self.print_success("Thank you for using UTech Tree Editor!")


if __name__ == "__main__":
    UTechTreeEditor().run()