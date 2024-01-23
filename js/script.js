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
  template: ` <div id="app">
  <form class="addCardForm" @submit.prevent="addCard">
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
      <div class="card" v-for="(group, groupIndex) in firstColumn" :key="group.id">
        <h3>{{ group.groupName }}</h3>
        <ul>
          <li v-for="(item , itemIndex) in group.items" :key="item.id">
            <input type="checkbox" v-model="item.checked"  @change="updateProgress(group)">
            {{ item.text }}
          </li>
        </ul>
      </div>
    </div>
    <div class="column">
      <h2>Второй столбец</h2>
      <div class="card" v-for="(group, groupIndex) in secondColumn" :key="group.id">
        <h3>{{ group.groupName }}</h3>
        <ul>
          <li v-for="(item , itemIndex) in group.items" :key="item.id">
            <input type="checkbox"  v-model="item.checked" @change="updateProgress(group)">
            {{ item.text }}
          </li>
        </ul>
      </div>
    </div>
    <div class="column">
      <h2>Третий столбец</h2>
      <div class="card" v-for="group in thirdColumn" :key="group.id">
        <h3>{{ group.groupName }}</h3>
        <ul>
          <li v-for="item in group.items" :key="item.id">
            <input type="checkbox"  v-model="item.checked">
            {{ item.text }}
          </li>
        </ul>
        <p v-if="group.isComplete"> {{ group.lastChecked }}</p>
      </div>
    </div>
  </div>
</div>`,
  watch: {
    firstColumn: {
      handler(newFirstColumn) {
        this.saveData();
      },
      deep: true
    },
    secondColumn: {
      handler(newSecondColumn) {
        this.saveData();
      },
      deep: true
    },
    thirdColumn: {
      handler(newThirdColumn) {
        this.saveData();
      },
      deep: true
    }
  },
  computed: {
    isFormValid() {
      return (
        this.groupName !== null &&
        this.groupName.trim() !== '' &&
        [this.inputOne, this.inputTwo, this.inputThr, this.inputFor, this.inputFiv].some(input => input !== null && input.trim() !== '')
      );
    }
  },
  methods: {
    addCard() {
        const inputs = [this.inputOne, this.inputTwo, this.inputThr, this.inputFor, this.inputFiv];
        const validInputs = inputs.filter(input => input !== null && input.trim() !== '');
        const numItems = Math.max(3, Math.min(5, validInputs.length));
        if (this.groupName) {
          const newGroup = {
            id: Date.now(),
            groupName: this.groupName,
            items: validInputs.slice(0, numItems).map(text => ({ text, checked: false }))
          }
          if (this.firstColumn.length < 3) {
            this.firstColumn.push(newGroup)
          }
        }
        this.groupName = null, this.inputOne = null, this.inputTwo = null, this.inputThr = null, this.inputFor = null, this.inputFiv = null
        this.isFirstColumnDisabled = false;
      },
      updateProgress(card) {
        const checkedCount = card.items.filter(item => item.checked).length;
        const progress = (checkedCount / card.items.length) * 100;
        card.isComplete = progress === 100;
        if (card.isComplete) {
          card.lastChecked = new Date().toLocaleString();
        }
        this.checkMoveCard();
      }, 
      MoveFirst() {
        if (this.secondColumn.length >= 5) {
          const isCardOver50Percent = this.secondColumn.some(card => {
            const progress = (card.items.filter(item => item.checked).length / card.items.length) * 100;
            return progress >= 50;
          });
  
          if (isCardOver50Percent) {
            this.isFirstColumnDisabled = true;
            this.firstColumn.forEach(card => {
              card.isDisabled = true;
            });
            return;
          }
        }
      },
      MoveSecond() {
        this.secondColumn.forEach(card => {
          const progress = (card.items.filter(item => item.checked).length / card.items.length) * 100;
          if (progress === 100) {
            card.isComplete = true;
            card.lastChecked = new Date().toLocaleString();
            this.thirdColumn.push(card);
            this.secondColumn.splice(this.secondColumn.indexOf(card), 1);
            this.MoveFirst();
          }
        });
        this.isFirstColumnDisabled = this.secondColumn.length >= 5;
      },
      saveData() {
        const data = {
          firstColumn: this.firstColumn,
          secondColumn: this.secondColumn,
          thirdColumn: this.thirdColumn
        };
        localStorage.setItem(storageKey, JSON.stringify(data));
      },
      checkMoveCard() {
        this.MoveFirst();
        this.MoveSecond();
      },
  }
})