import gutil from 'gulp-util'
import browserSync from 'browser-sync'
import stripAnsi from 'strip-ansi'

export default (errorList, taskName) => function(err) {
    const style = {
        pre: 'padding:1em;margin:-1em;background-color:#F44336;color:#FFF;',
        code: 'color:#FFF;word-wrap:break-word;font-family:monospace;',
    };
    let test = 'hello world'
    let bsMessage = '';
    let logMessage = '';

    function createStrings(err) {
        errorList.forEach(name => {
            const value = err[name];
            if (value) {
                bsMessage += `<u>${name}</u>` + ':\n' + value + '\n';
                logMessage += name + ':\n' + value + '\n';
            }
        })
    }

    createStrings(err);

    browserSync.notify(
        `<pre style='${style.pre}'><code style='${style.code}'>${stripAnsi(bsMessage)}</code></pre>`,
        300000
    );

    gutil.log(`${gutil.colors.red.bold(`error ${taskName}`)}:\n${logMessage}`);

    this.emit('end');
};
