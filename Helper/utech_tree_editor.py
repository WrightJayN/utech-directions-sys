"""
UTech Campus Navigation System - Tree Editor
A console-based menu application for managing buildings, floors, and rooms
With undo support and clean navigation
"""

import os
import json
import copy
import re
from typing import List, Dict, Optional
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
        
        # Undo system
        self.history = []
        self.history_index = -1
        self.max_history = 50
        self.last_action_desc = ""
        self.save_state("Initial state")
        
        # Colors
        self.HEADER = '\033[95m'
        self.OKBLUE = '\033[94m'
        self.OKGREEN = '\033[92m'
        self.WARNING = '\033[93m'
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
    
    def print_warning(self, text: str):
        print(f"{self.WARNING}⚠ {text}{self.ENDC}")
    
    def get_current_items(self) -> List[TreeNode]:
        if self.state == MenuState.BUILDINGS:
            return self.db.get_buildings() + self.db.get_gates()
        elif self.current_node:
            return self.current_node.children
        return []
    
    def display_menu(self):
        self.clear_screen()
        
        undo_status = "available" if self.history_index > 0 else "none"

        if self.state == MenuState.BUILDINGS:
            header_text = "🏢 UTech Campus Buildings & Gates"
        elif self.state == MenuState.FLOORS:
            header_text = f"📁 Floors in {self.current_node.name if self.current_node else 'Unknown Building'}"
        elif self.state == MenuState.ROOMS:
            header_text = f"🚪 Rooms in {self.current_node.name if self.current_node else 'Unknown Floor'}"
        self.print_header(header_text)

        self.print_info(
            f"Navigate: ↑↓ | Select: ENTER | Add: A | Delete: D | Rename: R | "
            f"Direction: Shift+R | Undo: U ({undo_status}) | Back: ESC"
        )
        
        print()
        items = self.get_current_items()
        
        for i, item in enumerate(items):
            prefix = "→ " if i == self.selected_index else "  "
            icon = {NodeType.GATE: "🚪", NodeType.BUILDING: "🏢", NodeType.FLOOR: "📁"}.get(item.node_type, "🚪")
            color = self.OKGREEN if i == self.selected_index else ""
            end_color = self.ENDC if i == self.selected_index else ""
            print(f"{prefix}{color}{icon} {item.name}{end_color}")
            if i == self.selected_index:
                print(f"    Direction: {item.worded_direction}")
        
        print()
        if self.state == MenuState.BUILDINGS:
            total = len(items)
            options = ["[A] Add Building", "[G] Add Gate", "[I] Import from treeDatabase.js",
                       "[S] Save & Export", "[Q] Quit"]
            for i, opt in enumerate(options):
                prefix = "→ " if self.selected_index == total + i else "  "
                print(f"  {prefix}{self.OKBLUE}{opt}{self.ENDC}")
        else:
            prefix = "→ " if self.selected_index == len(items) else "  "
            print(f"  {prefix}{self.OKBLUE}[A] Add {self.state.value[:-1].title()}{self.ENDC}")
            prefix_back = "→ " if self.selected_index == len(items) + 1 else "  "
            print(f"  {prefix_back}{self.OKBLUE}[ESC] Go Back{self.ENDC}")
        
        if self.last_action_desc:
            if self.last_action_desc == "undo":
                action_text = f"{self.OKGREEN}↶ Undo successful{self.ENDC}"
            else:
                action_text = f"{self.OKBLUE}Last action: {self.last_action_desc}{self.ENDC}"
            print(f"\n{action_text}")

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
        items = self.get_current_items()
        extra = 5 if self.state == MenuState.BUILDINGS else 2
        if self.selected_index > 0:
            self.selected_index -= 1

    def navigate_down(self):
        items = self.get_current_items()
        extra = 5 if self.state == MenuState.BUILDINGS else 2
        max_idx = len(items) + extra - 1
        if self.selected_index < max_idx:
            self.selected_index += 1

    def handle_enter(self):
        items = self.get_current_items()
        if self.selected_index < len(items):
            selected = items[self.selected_index]
            if self.state == MenuState.BUILDINGS and selected.node_type == NodeType.BUILDING:
                self.current_node = selected
                self.state = MenuState.FLOORS
                self.selected_index = 0
            elif self.state == MenuState.FLOORS:
                self.current_node = selected
                self.state = MenuState.ROOMS
                self.selected_index = 0
        else:
            offset = self.selected_index - len(items)
            if self.state == MenuState.BUILDINGS:
                if offset == 0: self.add_building()
                elif offset == 1: self.add_gate()
                elif offset == 2: self.perform_import()
                elif offset == 3: self.save_and_export()
                elif offset == 4: self.running = False
            else:
                if offset == 0:
                    self.add_floor() if self.state == MenuState.FLOORS else self.add_room()
                elif offset == 1:
                    self.go_back()

    def go_back(self):
        if self.state != MenuState.BUILDINGS:
            if self.state == MenuState.ROOMS and self.current_node and self.current_node.parent:
                self.current_node = self.current_node.parent
                self.state = MenuState.FLOORS
            elif self.state == MenuState.FLOORS:
                # Even if current_node is None or has no parent, go back to buildings
                self.current_node = None
                self.state = MenuState.BUILDINGS
            self.selected_index = 0

    def add_building(self):
        name = input("Enter building name: ").strip()
        direction = input("Enter worded direction: ").strip()
        if name and direction:
            node = TreeNode(name, direction, NodeType.BUILDING)
            self.db.root.add_child(node)
            self.save_state(f"add building '{name}'")

    def add_gate(self):
        name = input("Enter gate name: ").strip()
        direction = input("Enter worded direction: ").strip()
        if name and direction:
            node = TreeNode(name, direction, NodeType.GATE)
            self.db.root.add_child(node)
            self.save_state(f"add gate '{name}'")

    def add_floor(self):
        name = input("Enter floor name: ").strip()
        direction = input("Enter worded direction: ").strip()
        if name and direction and self.current_node:
            node = TreeNode(name, direction, NodeType.FLOOR)
            self.current_node.add_child(node)
            self.save_state(f"add floor '{name}'")

    def add_room(self):
        name = input("Enter room name: ").strip()
        direction = input("Enter worded direction: ").strip()
        if name and direction and self.current_node:
            node = TreeNode(name, direction, NodeType.ROOM)
            self.current_node.add_child(node)
            self.save_state(f"add room '{name}'")

    def rename_item(self):
        items = self.get_current_items()
        if self.selected_index >= len(items):
            return
        item = items[self.selected_index]
        old = item.name
        self.save_state(f"rename '{old}'")
        new = input(f"Enter new name for '{old}': ").strip()
        if new:
            item.name = new
            self.last_action_desc = f"renamed '{old}' → '{new}'"

    def rename_direction(self):
        items = self.get_current_items()
        if self.selected_index >= len(items):
            return
        item = items[self.selected_index]
        self.save_state(f"edit direction of '{item.name}'")
        new = input(f"Enter new direction for '{item.name}': ").strip()
        if new:
            item.worded_direction = new
            self.last_action_desc = f"updated direction of '{item.name}'"

    def delete_item(self):
        items = self.get_current_items()
        if self.selected_index >= len(items):
            return
        item = items[self.selected_index]
        name = item.name
        if input(f"Delete '{name}'? (y/N): ").strip().lower() != 'y':
            return
        self.save_state(f"delete '{name}'")
        if item.parent:
            item.parent.remove_child(item)
        else:
            self.db.root.remove_child(item)
        self.last_action_desc = f"deleted '{name}'"

    def save_state(self, desc: str):
        state = copy.deepcopy(self.db.root.to_dict())
        self.history = self.history[:self.history_index + 1]
        self.history.append((state, desc))
        if len(self.history) > self.max_history:
            self.history.pop(0)
        self.history_index = len(self.history) - 1
        if desc and desc != "undo":
            self.last_action_desc = desc

    def undo(self):
        if self.history_index > 0:
            self.history_index -= 1
            saved_tree, _ = self.history[self.history_index]
            self.db.root = self.rebuild_tree(saved_tree)
            self.last_action_desc = "undo"

    def rebuild_tree(self, data: Dict, parent: Optional[TreeNode] = None) -> TreeNode:
        node = TreeNode(data['name'], data['worded_direction'], NodeType(data['type']))
        node.parent = parent
        for child_data in data.get('children', []):
            child = self.rebuild_tree(child_data, node)
            node.add_child(child)
        return node

    def generate_tree_database_js(self) -> str:
        lines = ["// Auto-generated by UTech Tree Editor\n\n"]
        for building in self.db.get_buildings():
            lines.append(f"// {building.name}\n")
            lines.append(f"const {building.name} = new TreeNode('{building.name}', '{building.worded_direction}');\n")
            lines.append(f"this.root.addChild({building.name});\n\n")
            for floor in building.children:
                lines.append(f"const {floor.name} = new TreeNode('{floor.name}', '{floor.worded_direction}');\n")
                lines.append(f"{building.name}.addChild({floor.name});\n\n")
                lines.append(f"const {floor.name}Rooms = [\n")
                for room in floor.children:
                    lines.append(f"    ['{room.name}', '{room.worded_direction}'],\n")
                lines.append("];\n\n")
                lines.append(f"{floor.name}Rooms.forEach(([roomName, direction]) => {{\n")
                lines.append(f"    const roomNode = new TreeNode(roomName, direction);\n")
                lines.append(f"    {floor.name}.addChild(roomNode);\n")
                lines.append(f"    this.roomsHashMap.set(roomName.toLowerCase(), roomNode);\n")
                lines.append("});\n\n")
        
        for gate in self.db.get_gates():
            var = gate.name.replace(' ', '_')
            lines.append(f"const {var} = new TreeNode('{gate.name}', '{gate.worded_direction}');\n")
            lines.append(f"this.root.addChild({var});\n")
            lines.append(f"this.roomsHashMap.set('{gate.name}', {var});\n\n")
        
        return ''.join(lines)

    def import_from_js(self, content: str) -> bool:
        try:
            self.db.root = TreeNode('root', 'Starting point', NodeType.ROOT)
            node_map = {'root': self.db.root}
            last_floor = None

            comment_pat = re.compile(r'^\s*//\s*(.+)$')
            node_pat = re.compile(r"const\s+(\w+)\s*=\s*new\s+TreeNode\s*\(\s*'([^']+)'\s*,\s*'([^']+)'\s*\)")
            add_pat = re.compile(r"(this\.root|\w+)\.addChild\(\s*(\w+)\s*\)")
            room_pat = re.compile(r"\[\s*'([^']+)'\s*,\s*'([^']+)'\s*\]")

            lines = content.splitlines()
            pending_comment = None

            for line in lines:
                stripped = line.strip()
                if not stripped:
                    continue

                m = comment_pat.match(line)
                if m:
                    pending_comment = m.group(1).strip()
                    continue

                m = node_pat.search(stripped)
                if m:
                    var, name, direction = m.groups()
                    node_type = NodeType.ROOM
                    if pending_comment:
                        lc = pending_comment.lower()
                        if 'floor' in lc: node_type = NodeType.FLOOR
                        elif 'building' in lc: node_type = NodeType.BUILDING
                        elif 'gate' in lc: node_type = NodeType.GATE
                        pending_comment = None
                    if node_type == NodeType.ROOM:
                        if 'gate' in name.lower() or 'gate' in var.lower():
                            node_type = NodeType.GATE
                        elif 'building' in var.lower():
                            node_type = NodeType.BUILDING
                        elif 'floor' in var.lower():
                            node_type = NodeType.FLOOR
                    node = TreeNode(name, direction, node_type)
                    node_map[var] = node
                    continue

                m = add_pat.search(stripped)
                if m:
                    parent_key, child_var = m.groups()
                    parent = node_map.get('root' if parent_key == 'this.root' else parent_key)
                    child = node_map.get(child_var)
                    if parent and child:
                        parent.add_child(child)
                        if child.node_type == NodeType.FLOOR:
                            last_floor = child
                    continue

                if 'forEach' in stripped:
                    last_floor = None
                    continue

                for room_name, room_dir in room_pat.findall(line):
                    if last_floor:
                        room = TreeNode(room_name, room_dir, NodeType.ROOM)
                        last_floor.add_child(room)

            return True
        except Exception:
            return False

    def perform_import(self):
        path = "../storage/treeDatabase.js"
        try:
            with open(path, 'r', encoding='utf-8') as f:
                content = f.read()
            if self.import_from_js(content):
                self.save_state("import from treeDatabase.js")
                self.state = MenuState.BUILDINGS  # Force reset
                self.current_node = None
                self.selected_index = 0
                self.last_action_desc = "imported tree structure"
                return  # Auto refresh happens naturally in loop
            else:
                self.print_error("Failed to parse treeDatabase.js")
        except FileNotFoundError:
            self.print_error(f"File not found: {path}")
        except Exception as e:
            self.print_error(f"Error reading file: {e}")

    def save_and_export(self):
        self.clear_screen()
        self.print_header("💾 Save & Export")
        out_dir = "utech_export"
        os.makedirs(out_dir, exist_ok=True)

        with open(f"{out_dir}/treeDatabase.js", 'w') as f:
            f.write(self.generate_tree_database_js())
        self.print_success("Generated treeDatabase.js")

        with open(f"{out_dir}/structure.json", 'w') as f:
            json.dump(self.db.to_dict(), f, indent=2)
        self.print_success("Generated structure.json")

        self.generate_template_files(out_dir)

        print(f"\n{self.OKGREEN}All files exported to '{out_dir}/'{self.ENDC}")
        input("\nPress Enter to continue...")

    def generate_template_files(self, out_dir: str):
        # graphDatabase template
        with open(f"{out_dir}/graphDatabase_template.js", 'w') as f:
            f.write("// TODO: Add graph nodes with coordinates\n")
            for b in self.db.get_buildings():
                f.write(f"// const {b.name}_node = new GraphNode('{b.name}', 'building', x, y);\n")

        # buildingPictures template
        with open(f"{out_dir}/buildingPictures_template.js", 'w') as f:
            f.write("// Add to buildingPicturesOutput.js\nconst buildingPictures = {\n")
            for b in self.db.get_buildings():
                f.write(f"    '{b.name}': 'assets/buildings/{b.name}.jpg',\n")
            for g in self.db.get_gates():
                f.write(f"    '{g.name}': 'assets/buildings/{g.name.replace(' ', '_')}.jpg',\n")
            f.write("};\n")

        # floorPictures template
        with open(f"{out_dir}/floorPictures_template.js", 'w') as f:
            f.write("// Add to floorPicturesOutput.js\nconst floorPictures = {\n")
            for b in self.db.get_buildings():
                for fl in b.children:
                    f.write(f"    '{fl.name}': 'assets/floors/{fl.name}.jpg',\n")
            f.write("};\n")

        # pathDrawer template
        with open(f"{out_dir}/pathDrawer_template.js", 'w') as f:
            f.write("// Add to pathDrawer.js buildingVerticesHashMap\n")
            for b in self.db.get_buildings():
                f.write(f"['{b.name}', [\n    // TODO: Add vertices {{x: , y: }}\n]],\n")

    def run(self):
        while self.running:
            self.display_menu()
            try:
                key = self.handle_input()
                if key == 'up': self.navigate_up()
                elif key == 'down': self.navigate_down()
                elif key in ('\r', '\n'): self.handle_enter()
                elif key in ('escape', '\x7f'):
                    if self.state != MenuState.BUILDINGS:
                        self.go_back()
                elif key == 'a':
                    if self.state == MenuState.BUILDINGS: self.add_building()
                    elif self.state == MenuState.FLOORS: self.add_floor()
                    else: self.add_room()
                elif key == 'g' and self.state == MenuState.BUILDINGS: self.add_gate()
                elif key == 'i' and self.state == MenuState.BUILDINGS: self.perform_import()
                elif key == 's' and self.state == MenuState.BUILDINGS: self.save_and_export()
                elif key == 'q' and self.state == MenuState.BUILDINGS: self.running = False
                elif key == 'r': self.rename_item()
                elif key == 'R': self.rename_direction()
                elif key == 'd': self.delete_item()
                elif key == 'u': self.undo()
            except KeyboardInterrupt:
                self.running = False
            except Exception as e:
                self.print_error(f"Error: {e}")
                input("Press Enter...")

        self.clear_screen()
        self.print_success("Thank you for using UTech Tree Editor!")


if __name__ == "__main__":
    UTechTreeEditor().run()