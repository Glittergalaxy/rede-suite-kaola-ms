import { Vue, Component, Prop } from 'vue-property-decorator';
import Util from '@/base/utils';

@Component({
  name: 'kl-image-preview',
})
export default class KLImagePreview extends Vue {
  // 图片文件列表, 其中每个文件项包含下面的字段: { name: 图片文件名称, src: 图片文件的路径 }
  @Prop({ type: Array, default: () => [] })
  private imageList!: any[];

  // 当前图片文件的索引, 默认第一项为当前项
  @Prop({ type: Number, default: 0 })
  private curIndex!: number;

  private showVirtual: boolean = false;

  private virtualInfo: any = {
    rotate: 0,
    scale: 1,
    translateX: 0,
    translateY: 0,
    mouseDownX: 0,
    mouseDownY: 0,
    dragTarget: null,
  }

  private opList: any = [{
    name: 'zoomIn',
    icon: 'zoomin',
    fnName: 'zoomIn',
  }, {
    name: 'zoomOut',
    icon: 'zoomout',
    fnName: 'zoomOut',
  }, {
    name: 'resetZoom',
    icon: 'min-size',
    fnName: 'resetZoom',
  }, {
    name: 'rotateLeft',
    icon: 'anticlockwise',
    fnName: 'rotateLeft',
  }, {
    name: 'rotateRight',
    icon: 'clockwise',
    fnName: 'rotateRight',
  }, {
    name: 'download',
    icon: 'download',
    fnName: 'download',
  }];

  private onClose() {
    (this as any).close();
  }

  private onPrev() {
    let { curIndex } = this;
    let toIndex = this.imageList.length - 1;
    if (curIndex > 0) {
      curIndex -= 1;
      toIndex = curIndex;
    }
    this.setCurrentTo(toIndex);
  }

  private onNext() {
    let { curIndex } = this;
    let toIndex = 0;
    if (curIndex < this.imageList.length - 1) {
      curIndex += 1;
      toIndex = curIndex;
    }
    this.setCurrentTo(toIndex);
  }

  private setCurrentTo(toIndex: number) {
    const refs = this.$refs as any;
    const { curIndex } = this;

    this.showVirtual = false;
    this.virtualInfo.scale = 1;
    this.virtualInfo.rotate = 0;
    this.virtualInfo.translateX = 0;
    this.virtualInfo.translateY = 0;

    refs.fullImages[curIndex].style.opacity = 0;
    refs.fullImages[toIndex].style.opacity = 1;

    this.curIndex = toIndex;
  }

  private onFn(fnName: string, curIndex: number) {
    (this as any)[fnName](curIndex);
  }

  private zoomIn() {
    const step = this.getZoomInStep();
    this.showVirtual = true;
    this.virtualInfo.scale += step;
    this.setVirtualImageTransform();
  }

  private zoomOut() {
    const { virtualInfo } = this;
    const step = this.getZoomOutStep();
    const { xStep, yStep } = this.getTranslateStep(step);
    this.showVirtual = true;
    virtualInfo.scale -= step;
    virtualInfo.translateX -= xStep;
    virtualInfo.translateY -= yStep;
    this.setVirtualImageTransform();
  }

  private resetZoom() {
    const { virtualInfo } = this;
    this.showVirtual = true;
    virtualInfo.scale = 1;
    virtualInfo.translateX = 0;
    virtualInfo.translateY = 0;
    this.setVirtualImageTransform();
  }

  private getZoomInStep() {
    const scale = +this.virtualInfo.scale.toFixed(1);
    const step = this.getScaleStep();
    return scale <= 0.1 ? 0.1 : step;
  }

  private getZoomOutStep() {
    const scale = +this.virtualInfo.scale.toFixed(1);
    const step = this.getScaleStep();
    return scale >= 10 ? 1 : step;
  }

  private getScaleStep() {
    const scale = +this.virtualInfo.scale.toFixed(1);
    if (scale > 0.1 && scale < 1.5) {
      return 0.1;
    } if (scale >= 1.5 && scale < 4) {
      return 0.5;
    } if (scale >= 4 && scale < 10) {
      return 1;
    }
    return 0;
  }

  private getTranslateStep(scaleStep: number) {
    const { translateX, translateY, scale } = this.virtualInfo;
    const totalSteps = (+scale.toFixed(1) - 1) * 10;
    return {
      xStep: totalSteps ? (translateX / totalSteps) * scaleStep * 10 : 0,
      yStep: totalSteps ? (translateY / totalSteps) * scaleStep * 10 : 0,
    };
  }

  private rotateLeft() {
    this.showVirtual = true;
    this.virtualInfo.rotate -= 90;
    this.setVirtualImageTransform();
  }

  private rotateRight() {
    this.showVirtual = true;
    this.virtualInfo.rotate += 90;
    this.setVirtualImageTransform();
  }

  private download() {
    const file = this.imageList[this.curIndex];
    Util.download(file.src, { download: file.name });
  }

  private setVirtualImageTransform() {
    const {
      translateX, translateY, rotate, scale,
    } = this.virtualInfo;
    const transformInfo = (
      `translateX(${translateX}px)`
      + ` translateY(${translateY}px)`
      + ` rotate(${rotate}deg)`
      + ` scale(${scale})`
    );
    (this.$refs.virtualimage as any).style.transform = transformInfo;
  }

  private onMouseDown(e: any) {
    const { virtualInfo } = this;
    virtualInfo.mouseDownX = e.pageX;
    virtualInfo.mouseDownY = e.pageY;
    virtualInfo.dragTarget = e.target;
    virtualInfo.dragBoundary = this.getMaxMinTranslateValue();
  }

  private onMouseMove(e: any) {
    const { virtualInfo } = this;
    const originX = virtualInfo.mouseDownX;
    const originY = virtualInfo.mouseDownY;
    virtualInfo.dragBoundary = this.getMaxMinTranslateValue();

    const boundary = virtualInfo.dragBoundary;
    if (virtualInfo.dragTarget) {
      let translateX = e.pageX - originX;
      let translateY = e.pageY - originY;

      if (translateX > boundary.maxTranslateX) {
        translateX = boundary.maxTranslateX;
      } else if (translateX < boundary.minTranslateX) {
        translateX = boundary.minTranslateX;
      }

      if (translateY > boundary.maxTranslateY) {
        translateY = boundary.maxTranslateY;
      } else if (translateY < boundary.minTranslateY) {
        translateY = boundary.minTranslateY;
      }

      virtualInfo.translateX += translateX;
      virtualInfo.translateY += translateY;
      virtualInfo.mouseDownX = e.pageX;
      virtualInfo.mouseDownY = e.pageY;

      this.setVirtualImageTransform();
    }
  }

  private onMouseUp() {
    const { virtualInfo } = this;
    if (virtualInfo.dragTarget) {
      virtualInfo.mouseDownX = 0;
      virtualInfo.mouseDownY = 0;
      virtualInfo.dragTarget = null;
    }
  }

  private onMouseWheel(e: any) {
    if (e.wheelDelta > 0) {
      this.zoomIn();
    } else if (e.wheelDelta < 0) {
      this.zoomOut();
    }
  }

  private getMaxMinTranslateValue() {
    const virtualImg = this.$refs.virtualimage as any;
    const virtualZone = this.$refs.virtualzone as any;

    const virtualImgRect = virtualImg.getBoundingClientRect();
    const virtualZoneRect = virtualZone.getBoundingClientRect();
    const maxDeltaX = virtualZoneRect.left - virtualImgRect.left;
    const maxDeltaY = virtualZoneRect.top - virtualImgRect.top;
    const minDeltaX = virtualZoneRect.right - virtualImgRect.right;
    const minDeltaY = virtualZoneRect.bottom - virtualImgRect.bottom;

    return {
      maxTranslateX: maxDeltaX > 0 ? maxDeltaX : 0,
      maxTranslateY: maxDeltaY > 0 ? maxDeltaY : 0,
      minTranslateX: minDeltaX < 0 ? minDeltaX : 0,
      minTranslateY: minDeltaY < 0 ? minDeltaY : 0,
    };
  }


  public static preview(imageList: any = [], options: any = {}) {
    if (!(imageList instanceof Array) || !imageList.length) {
      return console.error('The imageList is required and must be a non-empty array.');
    }

    // 设置插入的父级元素，默认为document.body
    const parentNode = (options.el && document.querySelector(options.el)) || document.body;
    const instance = (new KLImagePreview() as any).$mount(document.createElement('div'));

    const props = {
      imageList,
      ...options,
      close: () => parentNode.removeChild(instance.$el),
    };

    for (const [key, value] of Object.entries(props)) {
      instance[key] = value;
    }

    parentNode.appendChild(instance.$el);
  }
}
