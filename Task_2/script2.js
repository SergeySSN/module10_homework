/*
Сверстайте кнопку, клик на которую будет выводить данные о размерах экрана 
с помощью alert. 
*/
const btn = document.querySelector('.j-btn-test');

btn.addEventListener('click', () => {
    const x = window.screen.width;
    const y = window.screen.height;  
    window.alert(`Размер твоего экрана: ширина = ${x} пикселей, высота = ${y} пикселей`);
});