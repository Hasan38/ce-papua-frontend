### Avatar dot

Avatars can have a small dot attached to them,
if you'd like to show a user status for example.
Add the `dot` prop to the target avatar component.
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
      dot
    />
    <VAvatar picture="/images/avatars/svg/vuero-1.svg" dot />
    <VAvatar
      picture=""
      size="medium"
      dot
    />
    <VAvatar
      picture="/21.jpg"
      size="large"
      dot
    />
    <VAvatar
      picture="/13.jpg"
      size="big"
      dot
    />
    <VAvatar
      picture=""
      size="xl"
      dot
    />
  </VFlex>
</template>
```

<!--/code-->

<!--example-->

<VFlex flex-wrap="wrap" align-items="flex-end" row-gap=".5rem" column-gap=".25rem">
  <VAvatar picture="/" size="small" dot />
  <VAvatar picture="/images/avatars/svg/vuero-1.svg" dot />
  <VAvatar picture="" size="medium" dot />
  <VAvatar picture="/21.jpg" size="large" dot />
  <VAvatar picture="/13.jpg" size="big" dot />
  <VAvatar picture="" size="xl" dot />
</VFlex>

<!--/example-->
