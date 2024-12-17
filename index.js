import fs from 'fs/promises';
import path from 'path';
import Piscina from 'piscina';

const inputDir = './fonts'; // Папка с исходными шрифтами
const outputDir = './converted-fonts'; // Папка для сохранения файлов

// Инициализация пула потоков
const piscina = new Piscina({
    filename: path.resolve('./worker.js'), // Путь к воркеру
    maxThreads: 8, // Максимальное количество потоков
});

// Создание выходной папки
const ensureOutputDir = async () => {
    await fs.mkdir(outputDir, { recursive: true });
};

// Обработка всех файлов
const processFonts = async () => {
    try {
        await ensureOutputDir();

        const files = await fs.readdir(inputDir);
        const ttfFiles = files.filter((file) => path.extname(file) === '.ttf');

        // Запускаем воркеры для каждого файла
        const tasks = ttfFiles.map((file) => {
            const inputFile = path.join(inputDir, file);
            return piscina.run({ inputFile, outputDir }); // Передаём данные через task
        });
        console.time('generate')
        await Promise.all(tasks);
        console.timeEnd('generate')
        console.log('🎉 Все шрифты успешно конвертированы!');
    } catch (err) {
        console.error('❌ Ошибка при обработке файлов:', err);
    }
};

processFonts();
