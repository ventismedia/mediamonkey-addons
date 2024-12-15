// This shim is because MM2024.0.0 does not support module scripts in dialogs.
//  The feature has been added to MM2024.0.1.
async function init(params) {
    console.log(params);
    const module = await import('file:///dialogs/dlgUndockedControl.js');
    window.init = module.init;
    module.init.apply(this, [params]);
}