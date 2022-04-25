
module.exports = class KareeGeneratorMeta {
    className = '';
    isController = false;
    // isModule = false;
    isScreen = false;
    isStatefull = true;
    path = '';
    name = '';

    setConfig(opts){
        // this.className ??= opts?.
        this.isController = opts.c || opts.controller  || false
        // this.isModule = opts.m || opts.module || false 
        this.isScreen = opts.s || opts.screen || false
        this.path = opts.path
        this.name = opts.name
        this.isStatefull = (opts.f || opts.stateful) || !(opts.stateless || opts.l)
        for(let key in opts){
            if(key.indexOf('className') > 0){
                this.className = opts[key]
            }
        }
    }
}