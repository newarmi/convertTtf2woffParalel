import fs from 'fs';
import path from 'path';
import ttf2woff2 from 'ttf2woff2';
import ttf2woff from 'ttf2woff';

export default async function ({ inputFile, outputDir }) {
    try {
        const fileName = path.basename(inputFile, '.ttf');
        const outputWoff2 = path.join(outputDir, `${fileName}.woff2`);
        const outputWoff = path.join(outputDir, `${fileName}.woff`);

        // Читаем и конвертируем шрифт
        const inputBuffer = fs.readFileSync(inputFile);
        const woff2Buffer = ttf2woff2(inputBuffer);
        const woffBuffer = ttf2woff(inputBuffer);

        // Сохраняем результаты
        fs.writeFileSync(outputWoff2, woff2Buffer);
        fs.writeFileSync(outputWoff, woffBuffer);

        console.log(`✅ Конвертирован: ${fileName}`);
        return `✅ Конвертирован: ${fileName}`;
    } catch (err) {
        console.error(`❌ Ошибка с файлом ${inputFile}: ${err.message}`);
        throw err;
    }
}
