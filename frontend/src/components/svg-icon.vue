<template>
  <div class="svg-icon" v-html="icon"></div>
</template>

<script>
export default {
  name: 'svg-icon',
  props: {
    name: {
      type: String,
      required: true,
    },
  },
  data() {
    return {};
  },
  computed: {
    icon() {
      const fileObj = require(`@/assets/icons/${this.name}.svg`);
      return fileObj.default;
    },
  },
};
</script>

<style lang="scss" scoped>
.svg-icon {
  width: 1em;
  height: 1em;
  overflow: hidden;
  display: inline-block;
  svg {
    width: 100%;
    height: 100%;
    fill: currentColor;
    display: flex;
    [fill="none"] {
      fill: none;
    }
    [stroke="none"] {
      stroke: none;
    }
  }
}
.svg-icon-hover {
  &:hover {
    svg {
      [fill] {
        fill: currentColor;
      }
      [stroke] {
        stroke: currentColor;
      }
    }
  }
}
</style>
