"""
UTech Campus Navigation System - Tree Editor
A console-based menu application for managing buildings, floors, and rooms
"""

import os
import json
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
        """Load sample buildings as starting point"""
        # Building 1
        building1 = TreeNode('building1', 'Go to Engineering Building (Building 1)', NodeType.BUILDING)
        self.root.add_child(building1)
        
        floor1ground = TreeNode('floor1ground', 'Go to Ground Floor', NodeType.FLOOR)
        building1.add_child(floor1ground)
        
        rooms = [
            ('1a37', 'Go to room 1A37'),
            ('1a36', 'Go to room 1A36'),
        ]
        for room_name, direction in rooms:
            room_node = TreeNode(room_name, direction, NodeType.ROOM)
            floor1ground.add_child(room_node)
        
        # Add gates
        main_gate = TreeNode('main gate', 'Start at Main Gate', NodeType.GATE)
        self.root.add_child(main_gate)

    def get_buildings(self) -> List[TreeNode]:
        return [child for child in self.root.children if child.node_type == NodeType.BUILDING]
    
    def get_gates(self) -> List[TreeNode]:
        return [child for child in self.root.children if child.node_type == NodeType.GATE]
    
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
        self.selection_mode = False  # For multi-select with Ctrl
        self.selected_indices = set()  # For multi-select
        self.running = True
        
        # Color codes for terminal
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
            buildings = self.db.get_buildings()
            gates = self.db.get_gates()
            return buildings + gates
        elif self.state == MenuState.FLOORS and self.current_node:
            return self.current_node.children
        elif self.state == MenuState.ROOMS and self.current_node:
            return self.current_node.children
        return []
    
    def display_menu(self):
        self.clear_screen()
        
        if self.state == MenuState.BUILDINGS:
            self.print_header("🏢 UTech Campus Buildings & Gates")
            self.print_info("Navigate: ↑↓ | Select: ENTER | Add: A | Delete: DEL | Rename: R/Shift+R | Save: S | Quit: Q")
        elif self.state == MenuState.FLOORS:
            self.print_header(f"📁 Floors in {self.current_node.name}")
            self.print_info("Navigate: ↑↓ | Select: ENTER | Back: ESC | Add: A | Delete: D | Rename: R/Shift+R")
        elif self.state == MenuState.ROOMS:
            self.print_header(f"🚪 Rooms in {self.current_node.name}")
            self.print_info("Navigate: ↑↓ | Back: ESC | Add: A | Delete: DEL | Rename: R/Shift+R")
        
        print()
        items = self.get_current_items()
        
        for i, item in enumerate(items):
            prefix = "→ " if i == self.selected_index else "  "
            selected_mark = "[✓]" if i in self.selected_indices else "   "
            
            if item.node_type == NodeType.GATE:
                type_icon = "🚪"
            elif item.node_type == NodeType.BUILDING:
                type_icon = "🏢"
            elif item.node_type == NodeType.FLOOR:
                type_icon = "📁"
            else:
                type_icon = "🚪"
            
            color = self.OKGREEN if i == self.selected_index else ""
            end_color = self.ENDC if i == self.selected_index else ""
            
            print(f"{selected_mark}{prefix}{color}{type_icon} {item.name}{end_color}")
            if i == self.selected_index:
                print(f"    Direction: {item.worded_direction}")
        
        # Add menu options
        print()
        if self.state == MenuState.BUILDINGS:
            total_items = len(items)
            print(f"  {'→' if self.selected_index == total_items else '  '} {self.OKBLUE}[A] Add Building{self.ENDC}")
            print(f"  {'→' if self.selected_index == total_items + 1 else '  '} {self.OKBLUE}[G] Add Gate{self.ENDC}")
            print(f"  {'→' if self.selected_index == total_items + 2 else '  '} {self.OKBLUE}[I] Import from treeDatabase.js{self.ENDC}")
            print(f"  {'→' if self.selected_index == total_items + 3 else '  '} {self.OKBLUE}[S] Save & Export{self.ENDC}")
            print(f"  {'→' if self.selected_index == total_items + 4 else '  '} {self.OKBLUE}[Q] Quit{self.ENDC}")
        else:
            print(f"  {'→' if self.selected_index == len(items) else '  '} {self.OKBLUE}[A] Add {self.state.value[:-1].title()}{self.ENDC}")
            print(f"  {'→' if self.selected_index == len(items) + 1 else '  '} {self.OKBLUE}[ESC] Go Back{self.ENDC}")
        
        if self.selected_indices:
            print(f"\n{self.WARNING}Selected {len(self.selected_indices)} items{self.ENDC}")
    
    def handle_input(self):
        import sys
        import tty
        import termios
        
        fd = sys.stdin.fileno()
        old_settings = termios.tcgetattr(fd)
        
        try:
            tty.setraw(sys.stdin.fileno())
            ch = sys.stdin.read(1)
            
            # Handle escape sequences (arrow keys)
            if ch == '\x1b':
                ch2 = sys.stdin.read(1)
                if ch2 == '[':
                    ch3 = sys.stdin.read(1)
                    if ch3 == 'A':  # Up arrow
                        return 'up'
                    elif ch3 == 'B':  # Down arrow
                        return 'down'
                return 'escape'
            
            return ch
        finally:
            termios.tcsetattr(fd, termios.TCSADRAIN, old_settings)
    
    def navigate_up(self):
        items = self.get_current_items()
        extra_items = 5 if self.state == MenuState.BUILDINGS else 2
        max_index = len(items) + extra_items - 1
        
        if self.selected_index > 0:
            self.selected_index -= 1
    
    def navigate_down(self):
        items = self.get_current_items()
        extra_items = 5 if self.state == MenuState.BUILDINGS else 2
        max_index = len(items) + extra_items - 1
        
        if self.selected_index < max_index:
            self.selected_index += 1
    
    def handle_enter(self):
        items = self.get_current_items()
        
        if self.selected_index < len(items):
            selected_item = items[self.selected_index]
            
            if self.state == MenuState.BUILDINGS:
                if selected_item.node_type == NodeType.BUILDING:
                    self.current_node = selected_item
                    self.state = MenuState.FLOORS
                    self.selected_index = 0
                    self.selected_indices.clear()
            elif self.state == MenuState.FLOORS:
                self.current_node = selected_item
                self.state = MenuState.ROOMS
                self.selected_index = 0
                self.selected_indices.clear()
        else:
            # Handle menu options
            menu_index = self.selected_index - len(items)
            
            if self.state == MenuState.BUILDINGS:
                if menu_index == 0:  # Add Building
                    self.add_building()
                elif menu_index == 1:  # Add Gate
                    self.add_gate()
                elif menu_index == 2:  # Import
                    self.perform_import()
                elif menu_index == 3:  # Save & Export
                    self.save_and_export()
                elif menu_index == 4:  # Quit
                    self.running = False
            else:
                if menu_index == 0:  # Add Floor/Room
                    if self.state == MenuState.FLOORS:
                        self.add_floor()
                    else:
                        self.add_room()
                elif menu_index == 1:  # Go Back
                    self.go_back()
    
    def go_back(self):
        if self.state == MenuState.ROOMS:
            self.current_node = self.current_node.parent
            self.state = MenuState.FLOORS
        elif self.state == MenuState.FLOORS:
            self.current_node = None
            self.state = MenuState.BUILDINGS
        self.selected_index = 0
        self.selected_indices.clear()
    
    def get_input(self, prompt: str) -> str:
        import sys
        import termios
        import tty
        
        fd = sys.stdin.fileno()
        old_settings = termios.tcgetattr(fd)
        
        try:
            termios.tcsetattr(fd, termios.TCSADRAIN, old_settings)
            return input(prompt)
        finally:
            pass
    
    def rename_item(self):
        items = self.get_current_items()
        if self.selected_index < len(items):
            item = items[self.selected_index]
            new_name = self.get_input(f"Enter new name for '{item.name}': ")
            if new_name:
                item.name = new_name
                self.print_success(f"Renamed to '{new_name}'")
                input("Press Enter to continue...")
    
    def rename_direction(self):
        items = self.get_current_items()
        if self.selected_index < len(items):
            item = items[self.selected_index]
            new_direction = self.get_input(f"Enter new direction for '{item.name}': ")
            if new_direction:
                item.worded_direction = new_direction
                self.print_success(f"Direction updated")
                input("Press Enter to continue...")
    
    def delete_selected(self):
        items = self.get_current_items()
        
        if self.selected_indices:
            # Delete multiple items
            to_delete = sorted(self.selected_indices, reverse=True)
            for idx in to_delete:
                if idx < len(items):
                    item = items[idx]
                    if self.current_node:
                        self.current_node.remove_child(item)
                    else:
                        self.db.root.remove_child(item)
            self.selected_indices.clear()
            self.print_success(f"Deleted {len(to_delete)} items")
        elif self.selected_index < len(items):
            # Delete single item
            item = items[self.selected_index]
            confirm = self.get_input(f"Delete '{item.name}'? (yes/no): ")
            if confirm.lower() == 'yes':
                if self.current_node:
                    self.current_node.remove_child(item)
                else:
                    self.db.root.remove_child(item)
                self.print_success(f"Deleted '{item.name}'")
        
        input("Press Enter to continue...")
    
    def add_room(self):
        if not self.current_node:
            return
        
        name = self.get_input("Enter room name: ")
        if not name:
            return
        
        direction = self.get_input("Enter room direction: ")
        if not direction:
            direction = f"Go to room {name}"
        
        room = TreeNode(name, direction, NodeType.ROOM)
        self.current_node.add_child(room)
        self.print_success(f"Added room '{name}'")
        input("Press Enter to continue...")
    
    def add_floor(self):
        if not self.current_node:
            return
        
        floor_name = self.get_input("Enter floor name: ")
        if not floor_name:
            return
        
        floor_direction = self.get_input("Enter floor direction: ")
        if not floor_direction:
            floor_direction = f"Go to {floor_name}"
        
        floor = TreeNode(floor_name, floor_direction, NodeType.FLOOR)
        self.current_node.add_child(floor)
        
        # Add rooms to the floor
        while True:
            room_name = self.get_input("Enter room name (or press Enter to finish): ")
            if not room_name:
                break
            
            room_direction = self.get_input("Enter room direction: ")
            if not room_direction:
                room_direction = f"Go to room {room_name}"
            
            room = TreeNode(room_name, room_direction, NodeType.ROOM)
            floor.add_child(room)
            
            add_more = self.get_input("Add another room? (yes/no): ")
            if add_more.lower() != 'yes':
                break
        
        self.print_success(f"Added floor '{floor_name}' with {len(floor.children)} rooms")
        input("Press Enter to continue...")
    
    def add_building(self):
        building_name = self.get_input("Enter building name: ")
        if not building_name:
            return
        
        building_direction = self.get_input("Enter building direction: ")
        if not building_direction:
            building_direction = f"Go to {building_name}"
        
        building = TreeNode(building_name, building_direction, NodeType.BUILDING)
        self.db.root.add_child(building)
        
        # Add floors
        while True:
            floor_name = self.get_input("Enter floor name (or press Enter to finish): ")
            if not floor_name:
                break
            
            floor_direction = self.get_input("Enter floor direction: ")
            if not floor_direction:
                floor_direction = f"Go to {floor_name}"
            
            floor = TreeNode(floor_name, floor_direction, NodeType.FLOOR)
            building.add_child(floor)
            
            # Add rooms to floor
            while True:
                room_name = self.get_input("Enter room name (or press Enter to skip): ")
                if not room_name:
                    break
                
                room_direction = self.get_input("Enter room direction: ")
                if not room_direction:
                    room_direction = f"Go to room {room_name}"
                
                room = TreeNode(room_name, room_direction, NodeType.ROOM)
                floor.add_child(room)
                
                add_more_rooms = self.get_input("Add another room to this floor? (yes/no): ")
                if add_more_rooms.lower() != 'yes':
                    break
            
            add_more_floors = self.get_input("Add another floor? (yes/no): ")
            if add_more_floors.lower() != 'yes':
                break
        
        self.print_success(f"Added building '{building_name}'")
        input("Press Enter to continue...")
    
    def add_gate(self):
        gate_name = self.get_input("Enter gate name: ")
        if not gate_name:
            return
        
        gate_direction = self.get_input("Enter gate direction: ")
        if not gate_direction:
            gate_direction = f"Start at {gate_name}"
        
        gate = TreeNode(gate_name, gate_direction, NodeType.GATE)
        self.db.root.add_child(gate)
        
        self.print_success(f"Added gate '{gate_name}'")
        input("Press Enter to continue...")
    
    def generate_tree_database_js(self) -> str:
        """Generate treeDatabase.js code"""
        code = []
        code.append("// Auto-generated by UTech Tree Editor\n")
        code.append("// Add this to your treeDatabase.js buildTree() method\n\n")
        
        for building in self.db.get_buildings():
            code.append(f"// {building.name}\n")
            code.append(f"const {building.name} = new TreeNode('{building.name}', '{building.worded_direction}');\n")
            code.append(f"this.root.addChild({building.name});\n\n")
            
            for floor in building.children:
                code.append(f"const {floor.name} = new TreeNode('{floor.name}', '{floor.worded_direction}');\n")
                code.append(f"{building.name}.addChild({floor.name});\n\n")
                
                code.append(f"const {floor.name}Rooms = [\n")
                for room in floor.children:
                    code.append(f"    ['{room.name}', '{room.worded_direction}'],\n")
                code.append("];\n\n")
                
                code.append(f"{floor.name}Rooms.forEach(([roomName, direction]) => {{\n")
                code.append(f"    const roomNode = new TreeNode(roomName, direction);\n")
                code.append(f"    {floor.name}.addChild(roomNode);\n")
                code.append(f"    this.roomsHashMap.set(roomName.toLowerCase(), roomNode);\n")
                code.append("});\n\n")
        
        # Add gates
        for gate in self.db.get_gates():
            code.append(f"const {gate.name.replace(' ', '_')} = new TreeNode('{gate.name}', '{gate.worded_direction}');\n")
            code.append(f"this.root.addChild({gate.name.replace(' ', '_')});\n")
            code.append(f"this.roomsHashMap.set('{gate.name}', {gate.name.replace(' ', '_')});\n\n")
        
        return ''.join(code)

    def import_from_js(self, js_content: str) -> bool:
        """Import tree structure from treeDatabase.js content"""
        import re
        
        try:
            # Clear existing data
            self.db.root = TreeNode('root', 'Starting point', NodeType.ROOT)
            
            node_map = {'root': self.db.root}
            pending_comment = None
            
            last_floor_node = None
            
            # Regex patterns
            comment_pat = re.compile(r'^\s*//\s*(.+)\s*$')
            node_pat = re.compile(r"const\s+(\w+)\s*=\s*new\s+TreeNode\s*\(\s*'([^']+)'\s*,\s*'([^']+)'\s*\);?")
            add_pat = re.compile(r"(this\.root|\w+)\.addChild\(\s*(\w+)\s*\);?")
            foreach_pat = re.compile(r"\w+Rooms\.forEach")
            room_entry_pat = re.compile(r"^\s*\[\s*'([^']+)'\s*,\s*'([^']+)'\s*\]\s*,?\s*$")
            
            lines = js_content.splitlines()
            
            for line in lines:
                stripped = line.strip()
                if not stripped:
                    continue

                # Comment
                comment_match = comment_pat.match(line)
                if comment_match:
                    pending_comment = comment_match.group(1).strip()
                    continue

                # Node creation
                node_match = node_pat.search(stripped)
                if node_match:
                    var_name, name, direction = node_match.groups()
                    
                    node_type = NodeType.ROOM
                    
                    if pending_comment:
                        comment_lower = pending_comment.lower()
                        if 'floor' in comment_lower:
                            node_type = NodeType.FLOOR
                        elif 'building' in comment_lower:
                            node_type = NodeType.BUILDING
                        elif 'gate' in comment_lower:
                            node_type = NodeType.GATE
                        pending_comment = None
                    
                    # Fallback
                    if node_type == NodeType.ROOM:
                        var_lower = var_name.lower()
                        name_lower = name.lower()
                        if 'gate' in name_lower or 'gate' in var_lower:
                            node_type = NodeType.GATE
                        elif var_name.startswith('building') or 'building' in var_lower:
                            node_type = NodeType.BUILDING
                        elif var_name.startswith('floor') or 'floor' in var_lower:
                            node_type = NodeType.FLOOR
                    
                    node = TreeNode(name, direction, node_type)
                    node_map[var_name] = node
                    continue

                # addChild
                add_match = add_pat.search(stripped)
                if add_match:
                    parent_str, child_var = add_match.groups()
                    parent_var = 'root' if parent_str == 'this.root' else parent_str
                    parent = node_map.get(parent_var)
                    child = node_map.get(child_var)
                    if parent and child:
                        parent.add_child(child)
                        
                        if child.node_type == NodeType.FLOOR:
                            last_floor_node = child
                    continue

                # forEach - reset last_floor
                if foreach_pat.search(stripped):
                    last_floor_node = None
                    continue

                # Room entry
                room_matches = room_entry_pat.findall(line)
                for room_name, room_dir in room_matches:
                    if last_floor_node:
                        room = TreeNode(room_name, room_dir, NodeType.ROOM)
                        last_floor_node.add_child(room)
            
            return True
            
        except Exception as e:
            print(f"Error importing: {e}")
            import traceback
            traceback.print_exc()
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
        
        input("Press Enter to continue...")
    
    def save_and_export(self):
        self.clear_screen()
        self.print_header("💾 Save & Export")
        
        output_dir = "utech_export"
        os.makedirs(output_dir, exist_ok=True)
        
        # Generate and save treeDatabase.js
        tree_code = self.generate_tree_database_js()
        with open(f"{output_dir}/treeDatabase.js", 'w') as f:
            f.write(tree_code)
        self.print_success(f"Generated {output_dir}/treeDatabase.js")
        
        # Save JSON structure
        with open(f"{output_dir}/structure.json", 'w') as f:
            json.dump(self.db.to_dict(), f, indent=2)
        self.print_success(f"Generated {output_dir}/structure.json")
        
        # Generate template files
        self.generate_template_files(output_dir)
        
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
        """Main application loop"""
        while self.running:
            self.display_menu()
            
            try:
                key = self.handle_input()
                
                if key == 'up':
                    self.navigate_up()
                elif key == 'down':
                    self.navigate_down()
                elif key == '\r' or key == '\n':  # Enter
                    self.handle_enter()
                elif key == 'escape' or key == '\x7f':  # ESC or Backspace
                    if self.state != MenuState.BUILDINGS:
                        self.go_back()
                elif key.lower() == 'r':
                    self.rename_item()
                elif key == 'R':  # Shift+R
                    self.rename_direction()
                elif key.lower() == 'a':
                    if self.state == MenuState.BUILDINGS:
                        self.add_building()
                    elif self.state == MenuState.FLOORS:
                        self.add_floor()
                    elif self.state == MenuState.ROOMS:
                        self.add_room()
                elif key.lower() == 'i' and self.state == MenuState.BUILDINGS:
                    self.perform_import()
                elif key.lower() == 'g' and self.state == MenuState.BUILDINGS:
                    self.add_gate()
                elif key.lower() == 's' and self.state == MenuState.BUILDINGS:
                    self.save_and_export()
                elif key.lower() == 'q' and self.state == MenuState.BUILDINGS:
                    self.running = False
                elif key.lower() == 'd':  # Delete key
                    self.delete_selected()
                elif key == ' ':  # Space for multi-select
                    items = self.get_current_items()
                    if self.selected_index < len(items):
                        if self.selected_index in self.selected_indices:
                            self.selected_indices.remove(self.selected_index)
                        else:
                            self.selected_indices.add(self.selected_index)
            
            except KeyboardInterrupt:
                self.running = False
            except Exception as e:
                self.print_error(f"Error: {str(e)}")
                input("Press Enter to continue...")
        
        self.clear_screen()
        self.print_success("Thank you for using UTech Tree Editor!")


if __name__ == "__main__":
    editor = UTechTreeEditor()
    editor.run()
