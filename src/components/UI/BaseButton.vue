<template>
  <button :type="type" :class="mode">
    <slot></slot>
  </button>
</template>

<script>
export default {
  props: ['type', 'mode'], // ici je peux configurer ces deux attributs de button en passant le nom de la classe (ex:flat) depuis le component dans lequel j'utilise le button
};
</script>
<style scoped>
button {
  color: #640032;
  transition: all 0.5s ease;
  display: inline-block;
  font-weight: 600;
  font-size: 14px;
  height: 38px;
  padding: 8px 20px;
  border-radius: 8px;
  background-image: linear-gradient(180deg, #fff, #f5f5fa);
  box-shadow: 0 4px 11px 0 rgb(37 44 97 / 15%),
    0 1px 3px 0 rgb(93 100 148 / 20%);
  border-color: #640032;
  cursor: pointer;
}

button:hover,
button:active {
  background-image: linear-gradient(180deg, #ce5269, #640032);
  color: white;
}

.selected {
  background-image: linear-gradient(180deg, #ce5269, #640032);
  color: white;
  border: none;
}

.submit-btn {
  background-image: linear-gradient(180deg,#3a006190, #3a0061);
  color: white;
  border: none;

}

.selected:hover,
.selected:active {
  background-color: #edd2ff;
}
</style>
