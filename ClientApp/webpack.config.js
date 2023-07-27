const path = require('path');

module.exports = {
    entry: './src/index.ts',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.(sass|less|css)$/,
                use: ['style-loader', 'css-loader']
            },
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    output: {
        library: {
            name: 'MYAPP',
            type: 'var'
        },
        filename: 'app-client.js',
        path: path.resolve(__dirname, '../wwwroot'),
    }
};