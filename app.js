
const root = document.getElementById('root')
const $elements = createObjectElement( root.querySelectorAll('[id]'), 'id', true )


$elements.lock.addEventListener('input', ()=> {
    root.setAttribute('style', $elements.lock.checked ? 'pointer-events:none' : '')
})

$elements.urlImage.addEventListener('input', ()=> {
    $elements.image.setAttribute('src', $elements.urlImage.value)
})

$elements.range.addEventListener('input', ()=> {
    $elements.image.setAttribute('style', `--size-img:${ $elements.range.value }px`)
})

$elements.image.scrollIntoView({ block: "center", inline: "center" })

let move = false
let coordenadaInicialX
let coordenadaInicialY
let scrollLeft
let scrollTop

$elements.container.addEventListener('mousedown', e => {
    if (e.which === 1 || e.button === 0) {

        move = true
        
        coordenadaInicialX = e.pageX - $elements.container.offsetLeft
        coordenadaInicialY = e.pageY - $elements.container.offsetTop

        scrollLeft  = $elements.container.scrollLeft
        scrollTop   = $elements.container.scrollTop

        $elements.container.setAttribute('style', 'overflow:hidden')
    
    }
})

$elements.container.addEventListener('mousemove', e => {
    if( move ) {
        const espaciadoX = e.pageX - $elements.container.offsetLeft
        const distanciaX = espaciadoX - coordenadaInicialX

        const espaciadoY = e.pageY - $elements.container.offsetTop
        const distanciaY = espaciadoY - coordenadaInicialY
        
        $elements.container.scrollLeft = scrollLeft - distanciaX
        $elements.container.scrollTop = scrollTop - distanciaY
    }
})

$elements.container.addEventListener('mouseup', e => {
    move = false
    $elements.container.setAttribute('style', '')
})


const customEventInput = new CustomEvent('input')

$elements.container.addEventListener('wheel', e => {
    if( move ) {
        if( e.deltaY > 0 ) {
            $elements.range.value = parseInt( $elements.range.value ) - 50
            
        } else {
            $elements.range.value = parseInt( $elements.range.value ) + 50
        }
    
        $elements.range.dispatchEvent( customEventInput )
    }
})


addEventListener('contextmenu', e => e.preventDefault())