// js/explorer/campusExplorer.js

import { BuildingPicturesOutput } from '../output/buildingPicturesOutput.js';
import { FloorPicturesOutput } from '../output/floorPicturesOutput.js';

class CampusExplorer {
    constructor(treeDB, containerId = 'buildingList') {
        this.treeDB = treeDB;
        this.container = document.getElementById(containerId);
        this.container.className = 'building-grid';
        this.placeholderSrc = 'assets/utech_crest.jpg';
    }

    populate() {
        this.container.innerHTML = '';

        const buildings = this.treeDB.root.children.filter(node =>
            !['main gate', 'back gate', 'walkin gate'].includes(node.name.toLowerCase())
        );

        buildings.forEach((building, index) => {
            const card = this.createBuildingCard(building);
            this.container.appendChild(card);

            // Staggered fade-in
            setTimeout(() => {
                card.classList.add('animate-in');
            }, index * 100);  // 100ms delay between each card
        });
    }

    createBuildingCard(building) {
        const card = document.createElement('div');
        card.className = 'building-card';
        card.dataset.expanded = 'false';

        const img = document.createElement('img');
        img.src = BuildingPicturesOutput.getBuildingPicture(building) || this.placeholderSrc;
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

        if (isExpanded) {
            const floorGrid = card.querySelector('.floor-grid');
            if (floorGrid) {
                floorGrid.classList.remove('expanded');
                setTimeout(() => floorGrid.remove(), 500);  // remove after animation
            }
            card.dataset.expanded = 'false';
            return;
        }

        const floorGrid = document.createElement('div');
        floorGrid.className = 'floor-grid';

        building.children.forEach((floor, index) => {
            const floorCard = this.createFloorCard(floor);
            floorGrid.appendChild(floorCard);

            // Animate floor cards in
            setTimeout(() => {
                floorCard.classList.add('animate-in');
            }, index * 80 + 200);  // slight delay after grid appears
        });

        card.appendChild(floorGrid);
        card.dataset.expanded = 'true';

        // Trigger expand animation
        requestAnimationFrame(() => {
            floorGrid.classList.add('expanded');
        });
    }

    createFloorCard(floor) {
        const card = document.createElement('div');
        card.className = 'floor-card';
        card.dataset.expanded = 'false';

        const img = document.createElement('img');
        img.src = FloorPicturesOutput.getFloorPicture(floor) || this.placeholderSrc;
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
            if (roomList) {
                roomList.classList.remove('expanded');
                setTimeout(() => roomList.remove(), 400);
            }
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

        requestAnimationFrame(() => {
            roomList.classList.add('expanded');
        });
    }
}

export { CampusExplorer };