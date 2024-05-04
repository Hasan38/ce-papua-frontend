### Squared avatar

Avatars can have a square shape instead of a circle shape
by adding the `squared` prop to the avatar component.
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
    <VAvatar
      picture="/"
      size="small"
      squared
    />
    <VAvatar picture="/images/avatars/svg/vuero-1.svg" squared />
    <VAvatar
      picture=""
      size="medium"
      squared
    />
    <VAvatar
      picture="/21.jpg"
      size="large"
      squared
    />
    <VAvatar
      picture="/13.jpg"
      size="big"
      squared
    />
    <VAvatar
      picture=""
      size="xl"
      squared
    />
  </VFlex>
</template>
```

<!--/code-->

<!--example-->

<VFlex flex-wrap="wrap" align-items="flex-end" row-gap=".5rem" column-gap=".25rem">
  <VAvatar picture="/" size="small" squared />
  <VAvatar picture="/images/avatars/svg/vuero-1.svg" squared />
  <VAvatar picture="" size="medium" squared />
  <VAvatar picture="/21.jpg" size="large" squared />
  <VAvatar picture="/13.jpg" size="big" squared />
  <VAvatar picture="" size="xl" squared />
</VFlex>

<!--/example-->
