import components from '../components';
import parsers from '../parsers';
import alias from './alias';
import manager from './manager';
import FormCreateFactory from '@form-create/core/src/index';
import makers from './maker';
import '../style/index.css';
import extendApi from './api';
import Antd from 'ant-design-vue';
import {QuestionCircleOutlined} from '@ant-design/icons-vue';
import modelFields from './modelFields';

function install(FormCreate) {
    FormCreate.componentAlias(alias);

    Object.keys(modelFields).forEach(k => {
        FormCreate.setModelField(k, modelFields[k]);
    })

    components.forEach(component => {
        FormCreate.component(component.name, component);
    });
    FormCreate.component(QuestionCircleOutlined.name, QuestionCircleOutlined);

    parsers.forEach((parser) => {
        FormCreate.parser(parser);
    });

    Object.keys(makers).forEach(name => {
        FormCreate.maker[name] = makers[name];
    });
}

function appUse(app) {
    app.use(Antd);
}

export default function antdvFormCreate() {
    return FormCreateFactory({
        ui: 'process.env.UI',
        version: 'process.env.VERSION',
        manager,
        appUse,
        install,
        extendApi,
        attrs: {
            normal: ['col', 'wrap'],
            array: ['className'],
            key: ['title', 'info'],
        }
    });
}
