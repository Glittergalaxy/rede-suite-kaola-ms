// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';

import KlText from '@/base/components/kl.text/index.vue';
import KlImagePreview from '@/base/components/kl.image.preview/index.vue';

const preview = function () {
  const imageList = [{
    name: 'Kaola.jpeg',
    src: 'http://haitao.nos.netease.com/9b73692b3a6b46d2be1de7d3be893834.jpg',
  }, {
    name: 'Music.jpg',
    src: 'http://haitao.nos.netease.com/7dfd9aa492694493be0fc1458d558536.jpg',
  }];
  (KlImagePreview as any).preview(imageList, {
    curIndex: 1,
    el: '#main',
  });
};

/* eslint-disable no-new */
new Vue({
  components: {
    KlText,
  },
  render(h) {
    return (<div id="app">
      <div id="main">
        <button onClick={preview}>open</button>
      </div>
    </div>);
  },
}).$mount('#app');
