function detectWebGLContext () {
    // Create canvas element. The canvas is not added to the
    // document itself, so it is never displayed in the
    // browser window.
    var canvas = document.createElement("canvas");
    // Get WebGLRenderingContext from canvas element.
    var gl = canvas.getContext("webgl")
      || canvas.getContext("experimental-webgl");
    // Report the result.
    if (gl && gl instanceof WebGLRenderingContext) {
        // nothing to do
    } else {
        messageDlg('This computer does not appear to support WebGL. The 3D Album View addon may not function properly.', 'Warning', ['btnOK'], {defaultButton: 'btnOK'}, undefined);
    }
}
detectWebGLContext();