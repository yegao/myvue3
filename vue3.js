/**
 * 返回App实例
 */
function _createApp(options) {
    const render = createRender();
    return render.createApp(options);
}

function _createRender({}) {
    // 返回自定义的渲染器
    return {
        createApp(options) { 
            return {
                // mount的目标：将组件配置解析为DOM，追加到宿主元素上
                mount(selector) {
                    const host = document.querySelector(selector);
                    
                    if (!options.render) {
                        options.render = this.compile(host.innerHTML);
                    }
                    if (options.setup) {
                        this.setupState = options.setup();
                    } else {
                        this.data = options.data();
                    }
                    this.proxy = new Proxy(this, {
                        get(target, key) {
                            if (key in target.setupState) {
                                return target.setupState[key];
                            }
                            return target.data[key];
                        },
                        set(target, key, val) {
                            if (key in target.setupState) {
                                target.setupState[key] = val;
                            } else {
                                target.data[key] = val;
                            }
                        }
                    })
                    const el = options.render.call(this.proxy);
                    host.innerHTML = '';
                    host.appendChild(el)
                },
                compile(template){
                    return function render() {
                        const div = document.createElement('div');
                        div.textContent = this.title;
                        return div;
                    }
                }
            }
        }
    }
}


const Vue = {
    createApp: _createApp,
    createRender: _createRender
}