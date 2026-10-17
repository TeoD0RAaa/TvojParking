import { availability } from './availability.js'

// Пинот е обичен HTML: круг во боја со бројот на слободни места
export function pinHtml({ free, total }, active) {
  const a = availability(free, total)
  return `<div class="pin pin--${a.level}${active ? ' pin--active' : ''}">
            <span class="pin__p">P</span><span class="pin__n">${Math.max(0, free)}</span>
          </div>`
}

// Сина точка за „твојата локација“ / местото каде одиш
export const ORIGIN_HTML = '<div class="origin"><span></span></div>'

// HTML елемент на Google мапата (OverlayView), центриран на lat/lng.
// Класата се прави откако ќе се вчита `google`, затоа е во функција.
export function createOverlayClass(google) {
  return class HtmlOverlay extends google.maps.OverlayView {
    constructor(position, onClick) {
      super()
      this.position = new google.maps.LatLng(position)
      this.div = document.createElement('div')
      this.div.className = 'gpin'
      if (onClick) this.div.addEventListener('click', (e) => { e.stopPropagation(); onClick() })
    }
    setContent(html, zIndex = 0) {
      this.div.innerHTML = html
      this.div.style.zIndex = zIndex
    }
    setPosition(position) {
      this.position = new google.maps.LatLng(position)
      this.draw()
    }
    onAdd() { this.getPanes().overlayMouseTarget.appendChild(this.div) }
    draw() {
      const p = this.getProjection()?.fromLatLngToDivPixel(this.position)
      if (p) { this.div.style.left = `${p.x}px`; this.div.style.top = `${p.y}px` }
    }
    onRemove() { this.div.remove() }
  }
}
