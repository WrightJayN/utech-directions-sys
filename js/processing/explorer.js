// js/explorer/campusExplorer.js

import { BuildingPicturesOutput } from '../output/buildingPicturesOutput.js';
import { FloorPicturesOutput } from '../output/floorPicturesOutput.js';

class CampusExplorer {
    constructor(treeDB, containerId = 'buildingList') {
        this.treeDB = treeDB;
        this.container = document.getElementById(containerId);
        this.container.className = 'building-grid';
        this.fallbackSvg = 'data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%27400%27 height=%27300%27%3E%3Crect fill=%27%23ddd%27 width=%27400%27 height=%27300%27/%3E%3Ctext x=%2750%25%27 y=%2750%25%27 dominant-baseline=%27middle%27 text-anchor=%27middle%27 font-family=%27sans-serif%27 font-size=%2718%27 fill=%27%23666%27%3EImage Not Available%3C/text%3E%3C/svg%3E';
    }

    populate() {
        this.container.innerHTML = ''; // Clear any previous content

        const buildings = this.treeDB.root.children.filter(node =>
            !['main gate', 'back gate', 'walkin gate'].includes(node.name.toLowerCase())
        );

        buildings.forEach(building => {
            const card = this.createBuildingCard(building);
            this.container.appendChild(card);
        });
    }

    createBuildingCard(building) {
        const card = document.createElement('div');
        card.className = 'building-card';
        card.dataset.expanded = 'false';

        const img = document.createElement('img');
        img.src = BuildingPicturesOutput.getBuildingPicture(building) || this.fallbackSvg;
        img.alt = building.name;
        img.className = 'building-img';

        const name = document.createElement('p');
        name.textContent = building.name.toUpperCase();

        card.appendChild(img);
        card.appendChild(name);

        card.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent triggering parent clicks
            this.toggleBuilding(card, building);
        });

        return card;
    }

    toggleBuilding(card, building) {
        const isExpanded = card.dataset.expanded === 'true';

        // Close if already open
        if (isExpanded) {
            // Remove existing floor grid
            const floorGrid = card.querySelector('.floor-grid');
            if (floorGrid) floorGrid.remove();
            card.dataset.expanded = 'false';
            return;
        }

        // Open: Create floor grid
        const floorGrid = document.createElement('div');
        floorGrid.className = 'floor-grid';

        building.children.forEach(floor => {
            const floorCard = this.createFloorCard(floor);
            floorGrid.appendChild(floorCard);
        });

        card.appendChild(floorGrid);
        card.dataset.expanded = 'true';
    }

    createFloorCard(floor) {
        const card = document.createElement('div');
        card.className = 'floor-card';
        card.dataset.expanded = 'false';

        const img = document.createElement('img');
        img.src = FloorPicturesOutput.getFloorPicture(floor) || this.fallbackSvg;
        img.alt = floor.name;
        img.className = 'floor-img';

        const name = document.createElement('p');
        name.textContent = floor.name.toUpperCase();

        card.appendChild(img);
        card.appendChild(name);

        card.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleFloor(card, floor);
        });

        return card;
    }

    toggleFloor(card, floor) {
        const isExpanded = card.dataset.expanded === 'true';

        if (isExpanded) {
            const roomList = card.querySelector('.room-list');
            if (roomList) roomList.remove();
            card.dataset.expanded = 'false';
            return;
        }

        const roomList = document.createElement('div');
        roomList.className = 'room-list';

        const rooms = floor.children
            .map(room => room.name)
            .sort((a, b) => a.localeCompare(b));

        rooms.forEach(roomName => {
            const p = document.createElement('p');
            p.textContent = roomName.toUpperCase();
            p.className = 'room-item';
            roomList.appendChild(p);
        });

        card.appendChild(roomList);
        card.dataset.expanded = 'true';
    }
}

export { CampusExplorer };