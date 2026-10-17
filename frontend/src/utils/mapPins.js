import { availability } from './availability.js'

// Пинот е обичен HTML: круг во боја со бројот на слободни места
export function pinHtml(free, total, active) {
  const a = availability(free, total)
  return `<div class="pin pin--${a.level}${active ? ' pin--active' : ''}">
            <span class="pin__p">P</span><span class="pin__n">${free}</span>
          </div>`
}

// HTML пин на Google мапата (OverlayView), центриран на lat/lng.
// Класата се прави откако ќе се вчита `google`, затоа е во функција.
export function createPinClass(google) {
  return class HtmlPin extends google.maps.OverlayView {
    constructor(position, onClick) {
      super()
      this.position = new google.maps.LatLng(position)
      this.div = document.createElement('div')
      this.div.className = 'gpin'
      this.div.addEventListener('click', (e) => { e.stopPropagation(); onClick() })
    }
    update({ free, total }, active) {
      this.div.innerHTML = pinHtml(free, total, active)
      this.div.style.zIndex = active ? 1000 : 0
    }
    onAdd() { this.getPanes().overlayMouseTarget.appendChild(this.div) }
    draw() {
      const p = this.getProjection().fromLatLngToDivPixel(this.position)
      if (p) { this.div.style.left = `${p.x}px`; this.div.style.top = `${p.y}px` }
    }
    onRemove() { this.div.remove() }
  }
}
