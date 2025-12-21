"""
UTech Campus Graph Editor
A Pygame-based editor for creating and editing graph nodes and edges on a map image.
Inspired by Upload Labs node interface.
"""

import pygame
import os
import sys
import re
import copy


# Node class
class GraphNode:
    def __init__(self, name, node_type, x, y):
        self.name = name
        self.node_type = node_type  # 'building', 'walkway', 'gate'
        self.x = x
        self.y = y


# Editor class
class UTechGraphEditor:
    def __init__(self, image_path="../assets/utech_map.png"):
        pygame.init()
        self.screen = pygame.display.set_mode((1200, 800))
        pygame.display.set_caption("UTech Graph Editor")

        try:
            self.image = pygame.image.load(image_path)
        except pygame.error:
            print(f"Error loading image {image_path}. Using placeholder.")
            self.image = pygame.Surface((2000, 4000))
            self.image.fill((200, 200, 200))

        self.image_rect = self.image.get_rect()

        self.nodes = []
        self.edges = []  # list of (node1, node2)

        self.camera_x = self.image_rect.width / 2
        self.camera_y = self.image_rect.height / 2
        self.zoom = 0.5  # Start zoomed out

        self.dragging = False
        self.drag_start_x = 0
        self.drag_start_y = 0

        self.selected_node = None
        self.selected_edge = None
        self.connecting = False
        self.start_node = None
        self.connect_dragging = False

        self.placing_type = None

        # Text input for naming/renaming
        self.input_active = False
        self.input_text = ""
        self.input_prompt = ""
        self.input_callback = None

        # Hover feedback
        self.hover_button_index = None
        self.hover_node = None
        self.hover_edge = None

        # Undo/Redo system
        self.history = []
        self.history_index = -1
        self.max_history = 50
        self.save_state()

        # Taskbar
        self.taskbar_rect = pygame.Rect(0, 700, 1200, 100)
        self.buttons = [
            "Add Building", "Add Walkway", "Add Gate",
            "Connect Mode", "Rename", "Delete",
            "Undo", "Redo", "Import", "Export"
        ]

        self.font = pygame.font.SysFont(None, 28)
        self.small_font = pygame.font.SysFont(None, 24)
        self.tooltip_font = pygame.font.SysFont(None, 22)
        self.running = True

    def screen_to_world(self, sx, sy):
        wx = (sx - self.screen.get_width() / 2) / self.zoom + self.camera_x
        wy = (sy - (self.screen.get_height() - 100) / 2) / self.zoom + self.camera_y
        return wx, wy

    def world_to_screen(self, wx, wy):
        sx = (wx - self.camera_x) * self.zoom + self.screen.get_width() / 2
        sy = (wy - self.camera_y) * self.zoom + (self.screen.get_height() - 100) / 2
        return sx, sy

    def clamp_camera(self):
        padding = 15
        visible_left = self.camera_x - (self.screen.get_width() / 2) / self.zoom
        visible_right = self.camera_x + (self.screen.get_width() / 2) / self.zoom
        visible_top = self.camera_y - (self.screen.get_height() - 100) / (2 * self.zoom)
        visible_bottom = self.camera_y + (self.screen.get_height() - 100) / (2 * self.zoom)

        if visible_right < self.image_rect.left + padding:
            self.camera_x = (self.image_rect.left + padding) + (self.screen.get_width() / 2) / self.zoom
        elif visible_left > self.image_rect.right - padding:
            self.camera_x = (self.image_rect.right - padding) - (self.screen.get_width() / 2) / self.zoom

        if visible_bottom < self.image_rect.top + padding:
            self.camera_y = (self.image_rect.top + padding) + (self.screen.get_height() - 100) / (2 * self.zoom)
        elif visible_top > self.image_rect.bottom - padding:
            self.camera_y = (self.image_rect.bottom - padding) - (self.screen.get_height() - 100) / (2 * self.zoom)

    def get_node_at(self, wx, wy):
        radius_world = 10
        for node in self.nodes:
            dist = ((wx - node.x) ** 2 + (wy - node.y) ** 2) ** 0.5
            if dist <= radius_world:
                return node
        return None

    def get_edge_at(self, sx, sy):
        threshold = 12
        for n1, n2 in self.edges:
            s1 = self.world_to_screen(n1.x, n1.y)
            s2 = self.world_to_screen(n2.x, n2.y)

            px = sx - s1[0]
            py = sy - s1[1]
            dx = s2[0] - s1[0]
            dy = s2[1] - s1[1]

            line_len_sq = dx*dx + dy*dy
            if line_len_sq == 0:
                continue

            proj = (px * dx + py * dy) / line_len_sq
            proj = max(0, min(1, proj))

            closest_x = s1[0] + proj * dx
            closest_y = s1[1] + proj * dy

            dist_sq = (sx - closest_x)**2 + (sy - closest_y)**2
            if dist_sq <= threshold**2:
                return (n1, n2)
        return None

    def start_text_input(self, prompt, default="", callback=None):
        self.input_active = True
        self.input_prompt = prompt
        self.input_text = default
        self.input_callback = callback

    def finish_text_input(self):
        if self.input_callback:
            self.input_callback(self.input_text.strip() or "Unnamed")
        self.input_active = False
        self.input_text = ""
        self.input_prompt = ""
        self.input_callback = None

    def save_state(self):
        state = {
            'nodes': copy.deepcopy(self.nodes),
            'edges': [(n1, n2) for n1, n2 in self.edges]
        }
        self.history = self.history[:self.history_index + 1]
        self.history.append(state)
        if len(self.history) > self.max_history:
            self.history.pop(0)
        self.history_index = len(self.history) - 1

    def undo(self):
        if self.history_index > 0:
            self.history_index -= 1
            self.restore_state(self.history[self.history_index])

    def redo(self):
        if self.history_index < len(self.history) - 1:
            self.history_index += 1
            self.restore_state(self.history[self.history_index])

    def restore_state(self, state):
        self.nodes = state['nodes']
        self.edges = state['edges']
        self.selected_node = None
        self.selected_edge = None

    def handle_taskbar_click(self, sx, sy):
        button_width = 1200 // len(self.buttons)
        index = sx // button_width
        if index < len(self.buttons):
            btn = self.buttons[index]
            if btn.startswith("Add "):
                # Extract type and lowercase it
                self.placing_type = btn[4:].lower()  # "Building" → "building", "Walkway" → "walkway", "Gate" → "gate"
                print(f"[DEBUG] Now placing node type: '{self.placing_type}'")
            elif btn == "Connect Mode":
                self.connecting = not self.connecting
            elif btn == "Rename":
                if self.selected_node:
                    self.start_text_input(
                        "Rename node:",
                        default=self.selected_node.name,
                        callback=lambda name: (setattr(self.selected_node, 'name', name), self.save_state())
                    )
            elif btn == "Delete":
                deleted = False
                if self.selected_edge:
                    if self.selected_edge in self.edges:
                        self.edges.remove(self.selected_edge)
                    deleted = True
                if self.selected_node:
                    self.edges = [e for e in self.edges if self.selected_node not in e]
                    self.nodes.remove(self.selected_node)
                    deleted = True
                if deleted:
                    self.save_state()
                self.selected_node = None
                self.selected_edge = None
            elif btn == "Undo":
                self.undo()
            elif btn == "Redo":
                self.redo()
            elif btn == "Import":
                self.import_from_js("../storage/graphDatabase.js")
            elif btn == "Export":
                self.export_to_js("utech_export/graphDatabase.js")

    def update_hover(self, mx, my):
        if self.taskbar_rect.collidepoint(mx, my):
            button_width = 1200 // len(self.buttons)
            self.hover_button_index = mx // button_width
            self.hover_node = None
            self.hover_edge = None
        else:
            self.hover_button_index = None
            wx, wy = self.screen_to_world(mx, my)
            self.hover_node = self.get_node_at(wx, wy)
            if self.hover_node is None:
                self.hover_edge = self.get_edge_at(mx, my)
            else:
                self.hover_edge = None

    def import_from_js(self, file_path):
        try:
            with open(file_path, 'r') as f:
                js_content = f.read()

            self.nodes = []
            self.edges = []
            var_to_node = {}
            unique_edge_set = set()

            lines = js_content.splitlines()
            for line in lines:
                stripped = line.strip()

                node_match = re.match(
                    r"const\s+(\w+)\s*=\s*new\s+GraphNode\s*\(\s*'([^']+)'\s*,\s*'([^']+)'\s*,\s*(\d+)\s*,\s*(\d+)\s*\);?",
                    stripped
                )
                if node_match:
                    var_name, name, node_type, x, y = node_match.groups()
                    node = GraphNode(name, node_type, int(x), int(y))
                    var_to_node[var_name] = node
                    self.nodes.append(node)
                    continue

                edge_match = re.match(
                    r"(\w+)\.addBidirectionalNeighbor\s*\(\s*(\w+)\s*\);?",
                    stripped
                )
                if edge_match:
                    var_a, var_b = edge_match.groups()
                    node_a = var_to_node.get(var_a)
                    node_b = var_to_node.get(var_b)
                    if node_a and node_b:
                        pair = tuple(sorted([node_a, node_b], key=id))
                        if pair not in unique_edge_set:
                            unique_edge_set.add(pair)
                            self.edges.append((node_a, node_b))
                    continue

            print(f"Imported {len(self.nodes)} nodes and {len(self.edges)} unique edges.")
            self.save_state()
            return True

        except Exception as e:
            print(f"Import error: {e}")
            return False

    def export_to_js(self, file_path):
        try:
            os.makedirs(os.path.dirname(file_path), exist_ok=True)
            code = []

            code.append("// Created Nodes")
            for node in self.nodes:
                var_name = node.name.replace(' ', '_').replace('-', '_')
                code.append(
                    f"const {var_name} = new GraphNode('{node.name}', '{node.node_type}', {int(node.x)}, {int(node.y)});"
                )

            code.append("\n// Add to utechgraph")
            for node in self.nodes:
                var_name = node.name.replace(' ', '_').replace('-', '_')
                code.append(f"this.utechgraph.set('{node.name}', {var_name});")

            code.append("\n// Connections")
            added_edges = set()
            for n1, n2 in self.edges:
                var1 = n1.name.replace(' ', '_').replace('-', '_')
                var2 = n2.name.replace(' ', '_').replace('-', '_')
                edge_key = tuple(sorted([var1, var2]))
                if edge_key not in added_edges:
                    code.append(f"{var1}.addBidirectionalNeighbor({var2});")
                    added_edges.add(edge_key)

            with open(file_path, 'w') as f:
                f.write("\n".join(code))

            print(f"Exported to {file_path}")

        except Exception as e:
            print(f"Export error: {e}")

    def draw(self):
        self.screen.fill((255, 255, 255))

        # Draw image
        scaled_w = int(self.image_rect.width * self.zoom)
        scaled_h = int(self.image_rect.height * self.zoom)
        scaled_image = pygame.transform.scale(self.image, (scaled_w, scaled_h))

        img_x = self.screen.get_width() / 2 - self.camera_x * self.zoom
        img_y = (self.screen.get_height() - 100) / 2 - self.camera_y * self.zoom

        self.screen.blit(scaled_image, (img_x, img_y))

        # Draw edges
        for n1, n2 in self.edges:
            s1 = self.world_to_screen(n1.x, n1.y)
            s2 = self.world_to_screen(n2.x, n2.y)
            is_selected = (n1, n2) == self.selected_edge or (n2, n1) == self.selected_edge
            is_hovered = (n1, n2) == self.hover_edge or (n2, n1) == self.hover_edge
            color = (255, 80, 80) if is_selected else (255, 255, 100) if is_hovered else (255, 255, 0)
            width = int(7 * self.zoom) if is_selected else int(5 * self.zoom) if is_hovered else int(3 * self.zoom)
            pygame.draw.line(self.screen, color, s1, s2, width)

        # Draw nodes
        for node in self.nodes:
            s = self.world_to_screen(node.x, node.y)
            radius = 10 * self.zoom
            # Fixed color logic - now correctly distinguishes all types
            if node.node_type == 'building':
                color = (255, 100, 100)  # Red for buildings
            elif node.node_type == 'gate':
                color = (100, 255, 100)  # Green for gates
            else:  # 'walkway' or any other
                color = (100, 100, 255)  # Blue for walkways

            if node == self.selected_node:
                pygame.draw.circle(self.screen, (255, 255, 255), s, radius + int(6 * self.zoom), int(4 * self.zoom))
            if node == self.hover_node:
                pygame.draw.circle(self.screen, (255, 255, 255), s, radius + int(4 * self.zoom))
                pygame.draw.circle(self.screen, color, s, radius + int(2 * self.zoom))
            pygame.draw.circle(self.screen, color, s, radius)
            pygame.draw.circle(self.screen, (0, 0, 0), s, radius, int(2 * self.zoom))

            text = self.small_font.render(node.name, True, (0, 0, 0))
            text = pygame.transform.scale(text, (int(text.get_width() * self.zoom), int(text.get_height() * self.zoom)))
            self.screen.blit(text, (s[0] + radius + 2, s[1] - text.get_height() // 2))


        # Draw connecting preview
        if self.connect_dragging and self.start_node:
            s1 = self.world_to_screen(self.start_node.x, self.start_node.y)
            mouse_pos = pygame.mouse.get_pos()
            pygame.draw.line(self.screen, (255, 0, 255), s1, mouse_pos, int(3 * self.zoom))

        # Draw taskbar
        pygame.draw.rect(self.screen, (200, 200, 200), self.taskbar_rect)
        button_width = 1200 // len(self.buttons)
        for i, btn in enumerate(self.buttons):
            btn_rect = pygame.Rect(i * button_width, 710, button_width - 10, 80)
            color = (0, 200, 0) if i == self.hover_button_index and btn == "Connect Mode" and self.connecting else \
                    (0, 180, 0) if i == self.hover_button_index else \
                    (0, 255, 0) if btn == "Connect Mode" and self.connecting else \
                    (150, 150, 150) if btn in ("Undo", "Redo") and ((btn == "Undo" and self.history_index <= 0) or (btn == "Redo" and self.history_index >= len(self.history)-1)) else \
                    (0, 0, 255)
            pygame.draw.rect(self.screen, color, btn_rect)
            text_color = (100, 100, 100) if btn in ("Undo", "Redo") and ((btn == "Undo" and self.history_index <= 0) or (btn == "Redo" and self.history_index >= len(self.history)-1)) else \
                         (255, 255, 100) if i == self.hover_button_index else (255, 255, 255)
            text = self.small_font.render(btn, True, text_color)
            self.screen.blit(text, (i * button_width + 10, 735))

        # Draw tooltip
        mx, my = pygame.mouse.get_pos()
        tooltip = None
        if self.hover_button_index is not None:
            tooltip = self.buttons[self.hover_button_index]
            if tooltip == "Connect Mode":
                tooltip += f" (Currently: {'ON' if self.connecting else 'OFF'})"
            elif tooltip == "Undo":
                tooltip += " (Ctrl+Z)" if self.history_index > 0 else " (nothing to undo)"
            elif tooltip == "Redo":
                tooltip += " (Ctrl+Y)" if self.history_index < len(self.history)-1 else " (nothing to redo)"
            elif tooltip == "Delete":
                if self.selected_node:
                    tooltip += f" (Node: {self.selected_node.name})"
                elif self.selected_edge:
                    n1, n2 = self.selected_edge
                    tooltip += f" (Edge: {n1.name} — {n2.name})"
                else:
                    tooltip += " (Select node or edge first)"
        elif self.hover_node:
            tooltip = f"Node: {self.hover_node.name} ({self.hover_node.node_type})"
        elif self.hover_edge:
            n1, n2 = self.hover_edge
            tooltip = f"Edge: {n1.name} — {n2.name}"

        if tooltip:
            tooltip_surf = self.tooltip_font.render(tooltip, True, (0, 0, 0))
            tooltip_bg = pygame.Surface((tooltip_surf.get_width() + 10, tooltip_surf.get_height() + 8))
            tooltip_bg.fill((255, 255, 200))
            tooltip_bg.set_alpha(220)
            self.screen.blit(tooltip_bg, (mx + 15, my + 15))
            self.screen.blit(tooltip_surf, (mx + 20, my + 19))

        # Draw text input box
        if self.input_active:
            input_y = 660
            prompt_surf = self.font.render(self.input_prompt, True, (0, 0, 0))
            self.screen.blit(prompt_surf, (20, input_y))

            box_rect = pygame.Rect(20, input_y + 40, 600, 40)
            pygame.draw.rect(self.screen, (255, 255, 255), box_rect)
            pygame.draw.rect(self.screen, (0, 0, 0), box_rect, 3)

            cursor = "|" if int(pygame.time.get_ticks() / 500) % 2 == 0 else ""
            text_surf = self.font.render(self.input_text + cursor, True, (0, 0, 0))
            self.screen.blit(text_surf, (30, input_y + 48))

        pygame.display.flip()

    def run(self):
        clock = pygame.time.Clock()
        while self.running:
            clock.tick(60)
            mx, my = pygame.mouse.get_pos()
            self.update_hover(mx, my)

            for event in pygame.event.get():
                if event.type == pygame.QUIT:
                    self.running = False

                elif event.type == pygame.TEXTINPUT and self.input_active:
                    self.input_text += event.text

                elif event.type == pygame.KEYDOWN:
                    if self.input_active:
                        if event.key == pygame.K_RETURN:
                            self.finish_text_input()
                        elif event.key == pygame.K_ESCAPE:
                            self.input_active = False
                            self.input_text = ""
                        elif event.key == pygame.K_BACKSPACE:
                            self.input_text = self.input_text[:-1]
                    else:
                        if event.mod & pygame.KMOD_CTRL:
                            if event.key == pygame.K_z:
                                self.undo()
                            elif event.key == pygame.K_y:
                                self.redo()
                        else:
                            speed = 200 / self.zoom
                            if event.key in (pygame.K_w, pygame.K_UP):
                                self.camera_y -= speed
                            elif event.key in (pygame.K_s, pygame.K_DOWN):
                                self.camera_y += speed
                            elif event.key in (pygame.K_a, pygame.K_LEFT):
                                self.camera_x -= speed
                            elif event.key in (pygame.K_d, pygame.K_RIGHT):
                                self.camera_x += speed

                elif event.type == pygame.MOUSEBUTTONDOWN:
                    if event.button == 1:
                        sx, sy = event.pos
                        if self.taskbar_rect.collidepoint(sx, sy):
                            self.handle_taskbar_click(sx, sy)
                        elif self.input_active and sy < 700:
                            self.input_active = False
                        else:
                            wx, wy = self.screen_to_world(sx, sy)
                            node = self.get_node_at(wx, wy)
                            edge = self.get_edge_at(sx, sy)
                            if node:
                                self.selected_node = node
                                self.selected_edge = None
                                if self.connecting:
                                    self.start_node = node
                                    self.connect_dragging = True
                                else:
                                    self.dragging = True
                                    self.drag_start_x = wx - node.x
                                    self.drag_start_y = wy - node.y
                            elif edge:
                                self.selected_edge = edge
                                self.selected_node = None
                            else:
                                self.selected_node = None
                                self.selected_edge = None
                                if self.placing_type:
                                    placing_type = self.placing_type
                                    self.start_text_input(
                                        f"Name for new {placing_type}:",
                                        callback=lambda name: [
                                            self.nodes.append(GraphNode(name, placing_type, wx, wy)),
                                            self.save_state(),
                                            setattr(self, 'placing_type', None)
                                        ]
                                    )
                                else:
                                    self.dragging = True
                                    self.drag_start_cam_x = self.camera_x
                                    self.drag_start_cam_y = self.camera_y
                                    self.drag_start_mouse_x = sx
                                    self.drag_start_mouse_y = sy

                elif event.type == pygame.MOUSEBUTTONUP:
                    if event.button == 1:
                        self.dragging = False
                        if self.connect_dragging:
                            wx, wy = self.screen_to_world(*event.pos)
                            target_node = self.get_node_at(wx, wy)
                            if target_node and target_node != self.start_node:
                                self.edges.append((self.start_node, target_node))
                                self.save_state()
                            self.connect_dragging = False
                            self.start_node = None

                elif event.type == pygame.MOUSEMOTION:
                    if self.dragging:
                        if self.selected_node:
                            wx, wy = self.screen_to_world(*event.pos)
                            old_x, old_y = self.selected_node.x, self.selected_node.y
                            self.selected_node.x = wx - self.drag_start_x
                            self.selected_node.y = wy - self.drag_start_y
                            if old_x != self.selected_node.x or old_y != self.selected_node.y:
                                self.save_state()
                        else:
                            dx = (self.drag_start_mouse_x - event.pos[0]) / self.zoom
                            dy = (self.drag_start_mouse_y - event.pos[1]) / self.zoom
                            self.camera_x = self.drag_start_cam_x + dx
                            self.camera_y = self.drag_start_cam_y + dy

                elif event.type == pygame.MOUSEWHEEL:
                    old_zoom = self.zoom
                    self.zoom += event.y * 0.1
                    self.zoom = max(0.1, min(3.0, self.zoom))

                    mx, my = pygame.mouse.get_pos()
                    wx, wy = self.screen_to_world(mx, my)
                    self.camera_x = wx - (mx - self.screen.get_width() / 2) / self.zoom
                    self.camera_y = wy - ((self.screen.get_height() - 100) / 2) / self.zoom

            self.clamp_camera()
            self.draw()

        pygame.quit()


if __name__ == "__main__":
    editor = UTechGraphEditor("../assets/utech_map.png")
    editor.run()