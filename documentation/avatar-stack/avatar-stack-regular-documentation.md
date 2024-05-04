### Regular stack

Vuero avatars can be stacked in an slighlty overlaping line.
Use the `<VAvatarStack />` component. The component takes 2 props:
`avatars` and `size`. Available sizes are normal, `small` and `medium`.

<!--code-->

```vue
<script setup lang="ts">
const users = [
  {
    id: 0,
    picture: '/',
    initials: 'AC',
    color: 'info',
    test: true,
  },
  {
    id: 1,
    picture: null,
    initials: 'JP',
    color: 'info',
  },
  // etc...
]
</script>

<template>
  <VAvatarStack :avatars="users" />
</template>
```

<!--/code-->

<!--example-->
<div class="avatar-stack">
    <VAvatar picture="/" />
    <VAvatar initials="JO" color="info" />
    <VAvatar picture="/images/avatars/svg/vuero-1.svg" />
    <VAvatar picture="" />
    <VAvatar initials="CP" color="success" />
    <VAvatar picture="" />
    <div class="v-avatar">
        <span class="avatar is-more">
            <span class="inner">
                <span>+2</span>
            </span>
        </span>
    </div>
</div>

<!--/example-->
