import gutil from 'gulp-util';
import browserSync from 'browser-sync';
import stripAnsi from 'strip-ansi';

export default (errorList, taskName) => function error(err) {
    const style = {
        pre: 'padding:1emmargin:-1embackground-color:#F44336color:#FFF',
        code: 'color:#FFFword-wrap:break-wordfont-family:monospace',
    };

    let bsMessage = '';
    let logMessage = '';

    errorList.forEach((name) => {
        const value = err[name];
        if (value) {
            bsMessage += `<u>${name}</u>:\n${value}\n`;
            logMessage += `${name}:\n${value}`;
        }
    });

    browserSync.notify(
        `<pre style='${style.pre}'><code style='${style.code}'>${stripAnsi(bsMessage)}</code></pre>`,
        300000,
    );

    gutil.log(`${gutil.colors.red.bold(`error ${taskName}`)}:\n${logMessage}`);

    this.emit('end');
};
