
const root = document.getElementById('root')
const $elements = createObjectElement( root.querySelectorAll('[id]'), 'id', true )


$elements.lock.addEventListener('input', ()=> {
    root.setAttribute('style', $elements.lock.checked ? 'pointer-events:none' : '')
})

$elements.urlImage.addEventListener('input', ()=> {
    $elements.image.children[0].setAttribute('src', $elements.urlImage.value.trim() || 'https://picsum.photos/1000/1000')
})

$elements.range.addEventListener('input', ()=> {
    $elements.image.style.transform = 'scale(' + (parseInt($elements.range.value) / parseInt($elements.range.max.slice(0, -1))) + ')';
})


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

$elements.container.addEventListener('mouseleave', ()=> {
    if( move ) {
        move = false
        $elements.container.setAttribute('style', '')
    }
})


const customEventInput = new CustomEvent('input')

$elements.container.addEventListener('wheel', e => {
    if( move ) {
        if( e.deltaY > 0 ) {
            $elements.range.value = parseInt( $elements.range.value ) - 2000000000
            
        } else {
            $elements.range.value = parseInt( $elements.range.value ) + 2000000000
        }
    
        $elements.range.dispatchEvent( customEventInput )
    }
})


$elements.container.addEventListener('dblclick', () => {
    $elements.image.scrollIntoView({ behavior: 'smooth', block: "center", inline: "center" })
})


$elements.container.addEventListener('contextmenu', e => {
    
    e.preventDefault()
    $elements.image.scrollIntoView({ behavior: 'smooth', block: "center", inline: "center" })

    navigator.clipboard.read().then(data => {
        // Itera a través de los items del portapapeles
        data.forEach(item => {
            
            const type = item.types.find( type => type.includes('image'))

            if( type ) {

                item.getType( type ).then( blob => {
                    $elements.image.children[0].setAttribute('src', URL.createObjectURL(blob))
                })

            }
          
        });
    }).catch(err => {
        console.error('No se pudo leer el portapapeles: ', err);
    });

})


$elements.image.scrollIntoView({ block: "center", inline: "center" })


let imagen = $elements.container
let escala = 1;
let escala2 = 1

let ultimaDistancia = 0;
let ultimaEscala = 1


// Detectar inicio del gesto de pellizco
imagen.addEventListener('touchstart', function(e) {
    const touches = e.touches;
    if (touches.length === 2) {

        ultimaDistancia = Math.hypot(
            e.touches[0].clientX - e.touches[1].clientX,
            e.touches[0].clientY - e.touches[1].clientY
        );

        e.preventDefault();

    }
});

// Detectar cambio del gesto de pellizco
imagen.addEventListener('touchmove', function(e) {
    const touches = e.touches;
    if (touches.length === 2) {
 
        e.preventDefault();

        const distanciaActual = Math.hypot(
            e.touches[0].clientX - e.touches[1].clientX,
            e.touches[0].clientY - e.touches[1].clientY
        );

        const escalaRelativa = distanciaActual / ultimaDistancia;

        escala *= escalaRelativa;

        const number  = parseInt(`1${'0'.repeat(10)}`)
        const number2 = parseInt( escala.toString().split('.').map(num => num.slice(0, 10)).join('') )


        ultimaDistancia = distanciaActual;
        $elements.range.value = number2

        $elements.image.style.transform = `scale(${ number2 / number })`;
        
    }
});


document.addEventListener('paste', e => {
    // Obtiene el objeto del evento
    const items = (e.clipboardData || e.originalEvent.clipboardData).items;
    // Itera a través de los items del portapapeles
    for (let index in items) {
        const item = items[index];
        // Verifica si es una imagen
        if (item.kind === 'file' && item.type.includes('image')) {
            const blob = item.getAsFile();
            setTimeout(()=> $elements.image.children[0].setAttribute('src', URL.createObjectURL(blob))) 
        }
    }
});
