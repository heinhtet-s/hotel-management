<template>
  <section class="info-section">
    <div
      v-for="info in infos"
      :key="info.title"
      class="info-container"
      :class="{ reverse: info.reverse }"
    >
      <figure class="image" :class="{ reverse: info.reverse }">
        <carousel
          :items-to-show="1"
          :autoplay="5000"
          :wrap-around="true"
          :pause-autoplay-on-hover="true"
        >
          <slide v-for="slide in info.img" :key="slide">
            <img :src="getImagePath(slide)" lazy="true" :alt="slide" />
          </slide>
        </carousel>
      </figure>
      <div class="info-texts" :class="{ reverse: info.reverse }">
        <h3 class="title" :class="{ reverse: info.reverse }">
          {{ info.title }}
        </h3>
        <p class="desc">
          {{ info.desc }} Lorem ipsum dolor sit amet consectetur adipisicing
          elit. Sint atque sit natus vero quisquam neque illum sunt voluptas
          odio consequuntur consectetur itaque nam ex, ratione repellat ipsum
          soluta impedit laborum! natus vero quisquam neque illum sunt voluptas
          odio consequuntur consectetur itaque nam ex, ratione repellat ipsum
          soluta impedit laborum!
        </p>
      </div>
    </div>
  </section>
</template>

<script>
import { Carousel, Slide } from 'vue3-carousel';
import 'vue3-carousel/dist/carousel.css';
export default {
  name: 'Info',
  components: { Carousel, Slide },
  methods: {
    getImagePath(img) {
      return require('../../assets/images/' + img);
    },
  },
  data() {
    return {
      infos: [
        {
          img: ['bar.jpg', 'restaurant.jpg', 'coffee.jpg'],
          title: 'Rooftop Bar',
          desc: '',
          reverse: false,
        },
        {
          img: ['restaurant.jpg', 'pool.jpg', 'coffee.jpg'],
          title: 'Restaurant',
          desc: '',
          reverse: true,
        },
        {
          img: ['coffee.jpg', 'bar.jpg', 'pool.jpg'],
          title: 'Coffee Counter',
          desc: '',
          reverse: false,
        },
        {
          img: ['apartment.jpg', 'bar.jpg', 'restaurant.jpg'],
          title: 'Apartments',
          desc: '',
          reverse: true,
        },
        {
          img: ['pool.jpg', 'coffee.jpg', 'bar.jpg'],
          title: 'Swimming Pools',
          desc: '',
          reverse: false,
        },
      ],
    };
  },
};
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
}
.info-section {
  width: 100%;
  color: var(--text-color);
}
.info-container {
  width: 100%;
  display: grid;
  grid-template-columns: 1.5fr 1fr;
}

.info-container.reverse {
  grid-template-columns: 1fr 1.25fr;
}

.image {
  width: 100%;
  aspect-ratio: 16 / 9;
  grid-column-start: 1;
  position: relative;
  overflow: hidden;
}
.image.reverse {
  grid-column-start: 2;
}
.image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.info-texts {
  width: 100%;
  text-align: left;
  padding-top: 1rem;
  grid-column-start: 2;
  grid-row-start: 1;
}

.info-texts.reverse {
  grid-column-start: 1;
  text-align: right;
}

.title {
  position: relative;
  width: max-content;
  margin-right: auto;
}

.title::after {
  content: '';
  position: absolute;
  width: 50%;
  height: 3px;
  left: 1rem;
  bottom: -1rem;
  background-color: var(--secondary);
}

.info-texts > * {
  padding-inline: 1rem;
}
.desc {
  font-size: 1.25rem;
  margin-top: 2rem;
}

.title.reverse {
  margin-left: auto;
  margin-right: unset;
}
.title.reverse::after {
  right: 1rem;
  left: unset;
}
@media screen and (max-width: 800px) {
  .info-container,
  .info-section.reverse {
    grid-template-columns: 1fr !important;
    padding-bottom: 1.5rem;
  }
  .image,
  .image.reverse {
    grid-row-start: 1;
    grid-column-start: 1;
  }
  .info-texts,
  .info-texts.reverse {
    grid-row-start: 2;
    grid-column-start: 1;
  }
  .desc {
    font-size: 1.1rem;
  }
  .title,
  .title.reverse {
    margin-inline: auto;
  }
  .title::after,
  .title.reverse::after {
    margin: 0;
    right: unset;
    left: 50%;
    transform: translateX(-50%);
  }
  * {
    text-align: center !important;
  }
}
</style>
