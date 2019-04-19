import { Vue, Component, Prop } from 'vue-property-decorator';

const PublicList = ['start', 'end', 'center'];
const JustifyContents = ['between', 'around'].concat(PublicList);
const AlignItems = ['baseline', 'stretch'].concat(PublicList);
const AlignContents = ['stretch', 'between', 'around'].concat(PublicList);
const AlignSelfs = ['auto', 'baseline', 'stretch'].concat(PublicList);

// 对齐可以直接设置align和justify, 或者设置alignH和alignV(分别表示水平和垂直对齐)
@Component({
  name: 'kl-flex',
})
export default class KLFlex extends Vue {
  @Prop({ type: Boolean, default: false })
  private inline!: boolean;

  @Prop({ type: Boolean, default: false })
  private column!: boolean;

  @Prop({ type: Boolean, default: false })
  private reverse!: boolean;

  @Prop({ type: Boolean, default: false })
  private noWrap!: boolean;

  @Prop({ type: Boolean, default: false })
  private wrapReverse!: boolean;

  @Prop({ type: String, default: 'div' })
  private tag!: string;

  @Prop({
    type: String,
    default: null,
    validator: (type: any) => JustifyContents.indexOf(type) !== -1,
  })
  private justify!: string;

  @Prop({
    type: String,
    default: null,
    validator: (type: any) => AlignItems.indexOf(type) !== -1,
  })
  private align!: string;

  @Prop({
    type: String,
    default: null,
    validator: (type: any) => AlignContents.indexOf(type) !== -1,
  })
  private alignH!: string;

  @Prop({
    type: String,
    default: null,
    validator: (type: any) => AlignContents.indexOf(type) !== -1,
  })
  private alignV!: string;

  @Prop({
    type: String,
    default: null,
    validator: (type: any) => AlignSelfs.indexOf(type) !== -1,
  })
  private alignSelf!: string;

  @Prop({ type: Number, default: 0 })
  private order!: string;

  @Prop({ type: Number, default: 0 })
  private grow!: string;

  @Prop({ type: Number, default: 0 })
  private shrink!: string;

  @Prop({ type: String, default: 'auto' })
  private basis!: string;

  render(h: any) {
    interface ComponentData {
      class: any[],
      style: any[]
    }

    const componentData:ComponentData = {
      class: [],
      style: [],
    };

    const styleObj: any = {};
    const classObj:any = {};

    let hAxis = 'justify-content';
    let hProp = 'justify';
    let vAxis = 'align-items';
    let vProp = 'align';

    if (this.column) {
      hAxis = 'align-items';
      hProp = 'align';
      vAxis = 'justify-content';
      vProp = 'justify';
    }

    componentData.class.push(`kl-flex${this.column ? '--column' : '--row'}
      ${this.reverse ? '-reverse' : ''}`);
    if (this.alignSelf) {
      componentData.class.push(`kl-flex--${this.alignSelf}`);
    }

    classObj['kl-flex--inline'] = this.inline;
    classObj['kl-flex--nowrap'] = this.noWrap;
    classObj[
      `kl-flex-wrap${this.wrapReverse ? '-reverse' : ''}`
    ] = !this.noWrap;
    classObj[`kl-flex--justify-content-${this.justify}`] = this.justify;
    classObj[`kl-flex--align-items-${this.align}`] = this.align;
    classObj[`kl-flex--${hAxis}-${this.alignH}`] = this.alignH && !(this as any)[hProp];
    classObj[`kl-flex--${vAxis}-${this.alignV}`] = this.alignV && !(this as any)[vProp];
    classObj[`kl-flex--align-self-${this.alignSelf}`] = this.alignSelf;

    styleObj.order = this.order;
    styleObj['flex-grow'] = this.grow;
    styleObj['flex-shrink'] = this.shrink;
    styleObj['flex-basis'] = this.basis;

    componentData.class.push(classObj);
    componentData.class.push(styleObj);

    return h(this.tag, componentData, this.$slots.default);
  }
}
