<template>
  <section class="hero">
    <div class="shade"></div>
    <div class="container">
      <div class="texts_outer_container">
        <div class="texts_inner_container">
          <h2>WELCOME</h2>
          <h2>FROM</h2>
          <h2>360 DEGREE BAR</h2>
        </div>
      </div>
      <div class="buttons_outer_container">
        <div class="booking-buttons" :class="{ animate: isBookBtnClicked }">
          <button
            @click="isBookBtnClicked = !isBookBtnClicked"
            class="booking-button"
          >
            BOOK A TABLE
          </button>
          <div class="links">
            <router-link class="booking-button" to="/book-restaurant"
              >FOR RESTAURANT</router-link
            >
            <router-link class="booking-button" to="/book-bar"
              >FOR BAR</router-link
            >
          </div>
        </div>
      </div>
    </div>
    <div class="socials">
      <a href=""
        ><i style="font-size: 2rem; color: white" class="fab fa-facebook"></i
      ></a>
    </div>
  </section>
</template>

<script>
export default {
  name: 'Hero',
  data() {
    return {
      isBookBtnClicked: false,
    };
  },
};
</script>

<style scoped>
.hero {
  width: 100vw;
  height: 100vh;
  background-image: url('~@/assets/images/home-bg.jpg');
  background-position: top;
  background-size: cover;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
}
.shade {
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1;
}
.container {
  position: relative;
  z-index: 4;
}
.texts_outer_container {
  height: 7rem;
  text-align: center;
  overflow: hidden;
}
.texts_inner_container {
  animation-name: textMove;
  animation-duration: 3s;
  animation-timing-function: ease;
  animation-fill-mode: forwards;
  animation-delay: 1s;
}
.texts_inner_container > h2 {
  color: var(--primary);
  font-weight: 600;
  font-size: 6rem;
  letter-spacing: 0.05em;
}
.buttons_outer_container {
  height: 3.5rem;
  overflow: hidden;
  margin-top: 1rem;
}
.animate {
  animation-name: buttonsMove;
  animation-duration: 1s;
  animation-timing-function: ease;
  animation-fill-mode: forwards;
}
.booking-buttons {
  color: var(--primary);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
}
.links {
  width: 30rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
}
.booking-button {
  padding-block: 0.5rem;
  width: 100%;
  max-width: 13rem;
  background-color: transparent;
  border: solid 3px var(--primary);
  border-radius: 100vw !important;
  color: var(--primary);
  letter-spacing: 0.075em;
  font-weight: 600;
  transition: all ease 200ms;
  text-align: center;
  text-decoration: none;
}
.booking-button:hover {
  transform: none;
  color: var(--primary);
  background-color: rgba(255, 255, 255, 0.15);
}
.socials {
  position: absolute;
  bottom: 1.75rem;
  right: 2rem;
  z-index: 2;
}

.fa-facebook:hover {
  color: var(--primary);
}

@keyframes textMove {
  0% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-8rem);
  }
  100% {
    transform: translateY(-16rem);
  }
}
@keyframes buttonsMove {
  from {
    transform: translateY(0);
  }
  to {
    transform: translateY(-3.8rem);
  }
}

@media screen and (max-width: 800px) {
  .texts_inner_container > h2 {
    font-size: 3rem;
    letter-spacing: 0.025em;
  }
  .socials {
    right: 1rem;
    bottom: 1rem;
  }
  .texts_outer_container {
    height: 3rem;
  }
  .booking-button {
    max-width: 10rem;
    letter-spacing: 0;
  }
  @keyframes textMove {
    0% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-4.5rem);
    }
    100% {
      transform: translateY(-9rem);
    }
  }
}
</style>
