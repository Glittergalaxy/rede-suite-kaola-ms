import { VueConstructor } from 'vue';
import KlDivider from './kl.divider/index.vue';
import KlMultiSelect from './kl.multi.select/index.vue';
import KlSelect from './kl.select/index.vue';
import KlText from './kl.text/index.vue';
import KlValidation from './kl.validation/index.vue';
import KlImagePreview from './kl.image.preview/index.vue';


const components = {
  KlDivider,
  KlMultiSelect,
  KlSelect,
  KlText,
  KlValidation,
  KlImagePreview,
};

export default (Vue: VueConstructor) => {
  Object.values(components).forEach((component: any) => {
    Vue.component(component.name, component);
  });

  /* eslint no-param-reassign: 0 */
  Vue.prototype.$preview = (KlImagePreview as any).preview;
};
