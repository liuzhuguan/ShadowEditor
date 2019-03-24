import UI from '../../../ui/UI';

/**
 * 滤镜选项窗口
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function FilterPanel(options) {
    UI.Control.call(this, options);
    this.app = options.app;
}

FilterPanel.prototype = Object.create(UI.Control.prototype);
FilterPanel.prototype.constructor = FilterPanel;

FilterPanel.prototype.render = function () {
    UI.create({
        xtype: 'div',
        id: 'panel',
        scope: this.id,
        parent: this.parent,
        style: this.style,
        children: [{
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: L_HUE
            }, {
                xtype: 'int',
                id: 'hue',
                scope: this.id,
                range: [0, 360],
                step: 10,
                onChange: this.save.bind(this)
            }]
        }, {
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: L_SATURATE
            }, {
                xtype: 'number',
                id: 'saturate',
                scope: this.id,
                range: [0, 2],
                value: 1,
                onChange: this.save.bind(this)
            }]
        }, {
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: L_BRIGHTNESS
            }, {
                xtype: 'number',
                id: 'brightness',
                scope: this.id,
                range: [0, 2],
                value: 1,
                onChange: this.save.bind(this)
            }]
        }, {
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: L_BLUR
            }, {
                xtype: 'number',
                id: 'blur',
                scope: this.id,
                range: [0, 20],
                value: 1,
                onChange: this.save.bind(this)
            }]
        }]
    }).render();

    this.dom = UI.get('panel', this.id).dom;
};

FilterPanel.prototype.update = function () {
    var hue = UI.get('hue', this.id);
    var saturate = UI.get('saturate', this.id);
    var brightness = UI.get('brightness', this.id);
    var blur = UI.get('blur', this.id);

    var renderer = this.app.editor.renderer;
    var filters = this.parseFilter(renderer.domElement.style.filter);
    hue.setValue(filters['hue-rotate']);
    saturate.setValue(filters['saturate']);
    brightness.setValue(filters['brightness']);
    blur.setValue(filters['blur']);
};

FilterPanel.prototype.save = function () {
    var hue = UI.get('hue', this.id);
    var saturate = UI.get('saturate', this.id);
    var brightness = UI.get('brightness', this.id);
    var blur = UI.get('blur', this.id);

    var filters = {
        'hue-rotate': hue.getValue(),
        'saturate': saturate.getValue(),
        'brightness': brightness.getValue(),
        'blur': blur.getValue(),
    };

    var renderer = this.app.editor.renderer;

    renderer.domElement.style.filter = this.serializeFilter(filters);
};

FilterPanel.prototype.serializeFilter = function (filters) {
    return `hue-rotate(${filters['hue-rotate']}deg) saturate(${filters['saturate']}) brightness(${filters['brightness']}) ` +
        `blur(${filters['blur']}px) `;
};

FilterPanel.prototype.parseFilter = function (str) {
    var list = str.split(' ');

    var filters = {
        'hue-rotate': 0,
        'saturate': 1,
        'brightness': 1,
        'blur': 0,
    };

    list.forEach(n => {
        if (n.startsWith('hue-rotate')) { // 色调
            filters['hue-rotate'] = n.substr(11, n.length - 4);
        } else if (n.startsWith('saturate')) { // 饱和度
            filters['saturate'] = n.substr(9, n.length - 1);
        } else if (n.startsWith('brightness')) { // 亮度
            filters['brightness'] = n.substr(11, n.length - 1);
        } else if (n.startsWith('blur')) { // 模糊
            filters['blur'] = n.substr(5, n.length - 3);
        }
    });

    return filters;
};

export default FilterPanel;