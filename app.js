
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