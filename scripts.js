document.addEventListener('DOMContentLoaded', function() {
    const airdropBtn = document.getElementById('airdrop-btn');
    const airdropModal = document.getElementById('airdrop-modal');
    const versionBtn = document.getElementById('version-btn');
    const versionModal = document.getElementById('version-modal');
    const closeModalButtons = document.querySelectorAll('.close-modal');
    const phoneVersionBtn = document.getElementById('phone-version');
    const pcVersionBtn = document.getElementById('pc-version');

    const clickableImg = document.getElementById('clickable');
    const coinsCountElement = document.querySelector('.coins-count');
    const progressFillElement = document.querySelector('.progress-fill');
    const levelTextElement = document.querySelector('.progress span:nth-child(3)');
    const experienceCountElement = document.querySelector('.experience-count');
    const energyCountElement = document.querySelector('.energy-count');
    const boostBtn = document.querySelector('.boost-btn');

    let coinsCount = 0;
    let clickProfit = 1; // Количество монет за клик
    let experience = 0; // Количество опыта
    let energy = 1000; // Стартовая энергия
    let isBoosted = false; // Флаг, указывающий на активность буста
    let boostCooldown = false; // Флаг, указывающий на кулдаун буста
    let currentLevel = 1; // Текущий уровень
    let maxLevels = 3; // Максимальное количество уровней
    let levelRequirements = [1488, 5252, 14880]; // Требования опыта для уровней

    // Звук при повышении уровня
    const levelUpSound = new Audio('path/to/level-up-sound.mp3');

    // Видео при повышении уровня
   

    // Функция для обновления стиля фона
    function updateBackground() {
        if (window.innerWidth < window.innerHeight) {
            document.body.style.backgroundColor = 'transparent';
        } else {
            document.body.style.backgroundColor = 'black'; // Или другой ваш цвет фона
        }
    }

    // Проверка фона при загрузке страницы и изменении размера окна
    updateBackground();
    window.addEventListener('resize', updateBackground);

    // Показать модальное окно аирдропа
    airdropBtn.addEventListener('click', function() {
        airdropModal.style.display = 'flex';
        document.body.style.overflow = 'hidden'; // Блокировать прокрутку
    });

    // Показать модальное окно выбора версии
    versionBtn.addEventListener('click', function() {
        versionModal.style.display = 'flex';
        document.body.style.overflow = 'hidden'; // Блокировать прокрутку
    });

    // Закрыть модальные окна
    closeModalButtons.forEach(function(button) {
        button.addEventListener('click', function() {
            airdropModal.style.display = 'none';
            versionModal.style.display = 'none';
            document.body.style.overflow = ''; // Разблокировать прокрутку
        });
    });

    // Переключение на телефонную версию
    phoneVersionBtn.addEventListener('click', function() {
        document.querySelector('.container').classList.add('mobile'); // Добавляем класс для мобильной версии
        document.body.classList.add('mobile'); // Увеличиваем шрифт
        // Закрываем модальное окно
        versionModal.style.display = 'none';
        document.body.style.overflow = ''; // Разблокировать прокрутку
    });

    // Переключение на ПК версию
    pcVersionBtn.addEventListener('click', function() {
        document.querySelector('.container').classList.remove('mobile'); // Убираем класс для мобильной версии
        document.body.classList.remove('mobile'); // Восстанавливаем шрифт
        // Закрываем модальное окно
        versionModal.style.display = 'none';
        document.body.style.overflow = ''; // Разблокировать прокрутку
    });

    // Клик по изображению
    clickableImg.addEventListener('click', function(event) {
        if ((energy >= clickProfit && !isBoosted) || isBoosted) { // Проверка, достаточно ли энергии или буст активен
            addCoins(clickProfit);
            addExperience(clickProfit);

            // Позиция клика
            const clickX = event.clientX;
            const clickY = event.clientY;

            // Анимация для отображения монет за клик
            displayCoinAnimation(clickX, clickY, clickProfit);

            // Анимация уменьшения и возврата изображения
            animateImage(clickableImg);

            if (!isBoosted) {
                // Расход энергии
                energy -= clickProfit; // Снимаем энергию равную количеству монет
                energyCountElement.textContent = `${energy} / 1000`;
            }
        } else {
            alert('Недостаточно энергии для клика!');
        }
    });

    // Функция для добавления монет
    function addCoins(amount) {
        coinsCount += amount;
        coinsCountElement.textContent = coinsCount;
    }

    // Функция для добавления опыта
    function addExperience(amount) {
        experience += amount;
        experienceCountElement.textContent = `${experience} / ${levelRequirements[currentLevel - 1]}`;
        updateProgress();

        if (experience >= levelRequirements[currentLevel - 1] && currentLevel < maxLevels) {
            levelUp();
        }
    }

    // Функция для обновления прогресса
    function updateProgress() {
        const percent = (experience / levelRequirements[currentLevel - 1]) * 100;
        progressFillElement.style.width = `${percent}%`;
    }

    // Функция для анимации отображения монет за клик
    function displayCoinAnimation(x, y, amount) {
        const coinText = document.createElement('span');
        coinText.className = 'coin-text';
        coinText.textContent = `+${amount}`;
        coinText.style.position = 'absolute';
        coinText.style.left = `${x}px`;
        coinText.style.top = `${y}px`;
        coinText.style.fontSize = '80px'; // Увеличьте размер шрифта по желанию
        coinText.style.color = 'gold'; // Установите цвет текста
        coinText.style.pointerEvents = 'none'; // Делает текст некликабельным
        coinText.style.transition = 'transform 1s, opacity 1s'; // Увеличиваем время анимации
        document.body.appendChild(coinText);

        // Анимация
        setTimeout(() => {
            coinText.style.transform = 'translateY(-500px)'; // Переместить вверх (больше)
            coinText.style.opacity = '0'; // Уменьшить непрозрачность
        }, 100);

        // Удаление после анимации
        setTimeout(() => {
            document.body.removeChild(coinText);
        }, 1600); // Увеличиваем время до удаления до 1600 мс
    }

    // Функция для анимации уменьшения и возврата изображения
    function animateImage(image) {
        image.style.transform = 'scale(0.9)'; // Уменьшаем изображение
        setTimeout(() => {
            image.style.transform = 'scale(1)'; // Возвращаем изображение обратно
        }, 100); // 100 мс
    }

    // Повышение уровня
    function levelUp() {
        currentLevel++;
        experience = 0; // Сбрасываем опыт
        experienceCountElement.textContent = `${experience} / ${levelRequirements[currentLevel - 1]}`;
        updateProgress();
        levelTextElement.textContent = `Level ${currentLevel} / ${maxLevels}`;

        // Воспроизвести звук
        levelUpSound.play();

        // // // // Показать видео
         //// // levelUpVideo.style.display = 'block';
         //levelUpVideo.play();

        // Скрыть видео через 8 секунд
         // // // // // // // //setTimeout(() => {
          // // // // // // // // // // // // //   levelUpVideo.style.display = 'none';
          // // // // // //   levelUpVideo.pause();
          // // // // //   levelUpVideo.currentTime = 0;
        // // // // }, 8000);
    }

    // Активация буста
    boostBtn.addEventListener('click', function() {
        if (!boostCooldown && !isBoosted) {
            isBoosted = true;
            clickProfit *= 5; // Увеличиваем количество монет за клик
            boostBtn.textContent = 'Boost Active';
            boostBtn.classList.add('boost-active'); // Добавляем класс для активного буста
            boostBtn.disabled = true; // Блокируем кнопку буста
			            boostCooldown = true; // Устанавливаем кулдаун буста
            setTimeout(() => {
                isBoosted = false;
                clickProfit /= 5; // Возвращаем количество монет за клик
                boostBtn.textContent = 'Activate Boost';
                boostBtn.classList.remove('boost-active'); // Убираем класс активного буста
                boostBtn.disabled = false; // Разблокируем кнопку буста
                boostCooldown = false; // Снимаем кулдаун
            }, 10000); // Продолжительность буста 10 секунд

            // Начинаем восстанавливать энергию в зависимости от состояния буста
            setInterval(() => {
                if (isBoosted) {
                    energy += 2; // Восстанавливаем 2 единицы энергии
                } else {
                    energy += 1; // Восстанавливаем 1 единицу энергии
                }

                // Ограничиваем максимальное значение энергии
                if (energy > 1000) {
                    energy = 1000; // Энергия не может превышать 1000
                }

                energyCountElement.textContent = `${energy} / 1000`;
            }, 2000); // Восстановление энергии каждые 2 секунды
        }
    });

    // Восстановление энергии на старте
    setInterval(() => {
        if (!isBoosted) {
            energy += 1; // Восстанавливаем 1 единицу энергии
        }

        // Ограничиваем максимальное значение энергии
        if (energy > 1000) {
            energy = 1000; // Энергия не может превышать 1000
        }

        energyCountElement.textContent = `${energy} / 1000`;
    }, 2000); // Восстановление энергии каждые 2 секунды
});
