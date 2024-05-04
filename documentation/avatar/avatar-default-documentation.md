### VAvatar

Vuero `<VAvatar />` components are rounded images used for media
and personal pages. Avatar sizes can be controled with 'size' prop.
Available size prop values `small`, `medium`, `large`, `big` and `xl`.
See code for more details about usage.

<!--code-->

```vue
<template>
  <VFlex
    flex-wrap="wrap"
    align-items="flex-end"
    row-gap=".5rem"
    column-gap=".25rem"
  >
    <VAvatar picture="/" size="small" />
    <VAvatar picture="/images/avatars/svg/vuero-1.svg" />
    <VAvatar picture="" size="medium" />
    <VAvatar picture="/21.jpg" size="large" />
    <VAvatar picture="/13.jpg" size="big" />
    <VAvatar picture="" size="xl" />
  </VFlex>
</template>
```

<!--/code-->

<!--example-->

<VFlex flex-wrap="wrap" align-items="flex-end" row-gap=".5rem" column-gap=".25rem">
  <VAvatar picture="/" size="small" />
  <VAvatar picture="/images/avatars/svg/vuero-1.svg" />
  <VAvatar picture="" size="medium" />
  <VAvatar picture="/21.jpg" size="large" />
  <VAvatar picture="/13.jpg" size="big" />
  <VAvatar picture="" size="xl" />
</VFlex>

<!--/example-->
