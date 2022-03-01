import path from 'path';
import { defineConfig } from 'vite';

const formatNames = {
    'umd': 'min',
    'es': 'module'
};

export default defineConfig({
    build: {
        lib: {
            entry: path.resolve(__dirname, 'src/index.ts'),
            name: 'tictactoe',
            fileName: (format) => `tictactoe.${formatNames[format]}.js`
        },
    },
    publicDir: false
})