const storageKey = 'cards';
const storageData = localStorage.getItem(storageKey);
const initialData = storageData ? JSON.parse(storageData) : {firstColumn: [], secondColumn: [], thirdColumn: []};

let app = new Vue({
  el: '#app',
  data: {
    firstColumn: initialData.firstColumn,
    secondColumn: initialData.secondColumn,
    thirdColumn: initialData.thirdColumn,
    groupName: null,
    inputOne: null,
    inputTwo: null,
    inputThr: null,
    inputFor: null,
    inputFiv: null,
  },
  template: `
  <div id="app">
    <form class="addCardForm">
      <p class="form-p">
        <label for="GroupName">Название карточки:</label>
        <input id="GroupName" v-model="groupName">
      </p>
      <p class="form-p">
        <label for="InputOne">Пункт 1:</label>
        <input id="InputOne" v-model="inputOne">
      </p>
      <p class="form-p">
        <label for="InputTwo">Пункт 2:</label>
        <input id="InputTwo" v-model="inputTwo">
      </p>
      <p class="form-p">
        <label for="InputThr">Пункт 3:</label>
        <input id="InputThr" v-model="inputThr">
      </p>
      <p class="form-p">
        <label for="InputFor">Пункт 4:</label>
        <input id="InputFor" v-model="inputFor">
      </p>
      <p class="form-p">
        <label for="InputFiv">Пункт 5:</label>
        <input id="InputFiv" v-model="inputFiv">
      </p>
      <p class="form-p button">
        <input type="submit" value="Создать">
      </p>
    </form>
    <div class="columns" style="display: flex; justify-content: space-evenly;">
      <div class="column">
        <h2>Первый столбец</h2>
        </div>
      </div>
      <div class="column">
        <h2>Второй столбец</h2>
        <div class="card" v-for="(group, groupIndex) in secondColumn" :key="group.id">
        </div>
      </div>
      <div class="column">
        <h2>Третий столбец</h2>
      </div>
    </div>
  </div>
  `,
  computed: {
  },
  methods: {

  }
})