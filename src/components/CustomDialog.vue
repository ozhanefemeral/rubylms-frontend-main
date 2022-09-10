<template>
  <div>
    <v-dialog
      :persistent="persistent"
      v-model="show"
      @input="$emit('input')"
      max-width="600"
    >
      <v-card>
        <v-card-title>
          <slot name="title"></slot>
        </v-card-title>
        <v-card-text>
          <slot name="content"></slot>
        </v-card-text>
        <v-card-actions style="position: fixed">
          <slot name="actions"> </slot>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  // props: ["value", "title", "persistent"],
  props: {
    value: Boolean,
    title: String,
    persistent: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    show: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit("input", value);
      },
    },
  },
};
</script>

<style>
</style>