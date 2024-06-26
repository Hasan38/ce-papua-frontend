### VSnack white

Vuero provides a `<VSnack />` component than can be used to show
a pill with an image. Use the `image` prop to insert an image
inside the component. You cna also use the `white` prop to make
the component background white.

<!--code-->

```vue
<template>
  <VSnack
    title="Support"
    white
    image="/demo/photos/misc/buoy.jpg"
  >
    <i class="iconify" data-icon="feather:x" />
  </VSnack>
  <VSnack
    title="Metamovies"
    white
    image="/images/icons/logos/metamovies.svg"
  >
    <i class="iconify" data-icon="feather:x" />
  </VSnack>
  <VSnack
    title="Corporate"
    white
    image="/"
  >
    <i class="iconify" data-icon="feather:x" />
  </VSnack>
  <VSnack
    title="English"
    white
    image="/images/icons/flags/united-states-of-america.svg"
  >
    <i class="iconify" data-icon="feather:x" />
  </VSnack>
  <VSnack
    title="Slicer"
    white
    image="/images/icons/logos/slicer.svg"
  >
    <i class="iconify" data-icon="feather:x" />
  </VSnack>
</template>
```

<!--/code-->

<!--example-->

<div class="snacks">
    <VSnack title="Support" white  image="/demo/photos/misc/buoy.jpg">
        <i class="iconify" data-icon="feather:x"></i>
    </VSnack>
    <VSnack title="Metamovies" white  image="/images/icons/logos/metamovies.svg">
        <i class="iconify" data-icon="feather:x"></i>
    </VSnack>
    <VSnack title="Corporate" white  image="/">
        <i class="iconify" data-icon="feather:x"></i>
    </VSnack>
    <VSnack title="English" white  image="/images/icons/flags/united-states-of-america.svg">
        <i class="iconify" data-icon="feather:x"></i>
    </VSnack>
    <VSnack title="Slicer" white  image="/images/icons/logos/slicer.svg">
        <i class="iconify" data-icon="feather:x"></i>
    </VSnack>
</div>

<!--/example-->
