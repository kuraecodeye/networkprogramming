const store = {
    state: {
        currentComponent: 'message-name-choice',
        senderName: null,
        ws: null
    },
    setCurrentComponent(newValue) {
        this.state.currentComponent = newValue;
    },
    setSenderName(newValue) {
        this.state.senderName = newValue;
    },
    setWs(newValue) {
        this.state.ws = newValue;
    }
};




Vue.component('message-component', {
    data: function() {
        return {
            borderMessage: 'border-primary',
            borderMessageSystem: 'border-info'

        }
    },
    props: ['message'],
    template: `
<div class="message__container col-12">
<div class="container border rounded" v-bind:class="[message.sender !== 'SYSTEM' ? borderMessage : borderMessageSystem]">
<div class="row">
    <div class="col-6 font-weight-bold text-primary" v-if="message.sender !== 'SYSTEM'"> {{ message.sender }} </div>
    <div class="col text-secondary float-right text-right"> {{ message.time }} </div>
</div>
<div class="row">
<div class="col-7 word-wrap"> {{ message.content }} </div>
</div>
</div>
</div>`
});

Vue.component('message-input', {
    data: function () {
      return {
          msgText: null,
          sharedData: store.state
      }
    },
    methods: {
       sendMessage() {
           if (this.msgText) {
               this.sharedData.ws.send(JSON.stringify({
                   content: this.msgText,
                   sender: store.state.senderName
               }));
               this.msgText = null;
           }
       }
    },
   template: `
<div class="row">
   <div class="container fixed-bottom message-input_container"> 
      <div class="row">
        <input type="text" class="form-control col-10" placeholder="Type message here" v-model="msgText" v-on:keyup.enter="sendMessage">
        <button type="button" class="btn btn-primary col-2" @click="sendMessage">Send</button>
      </div>
   </div>
</div>
   `
});

Vue.component('message-name-choice', {
    data: function() {
        return {
            sender: null,
            localSenderName: this.senderName,
            sharedData: store.state,
            store: store
        }
    },
    template: `
<div class="row justify-content-center align-items-center">
<div class="card col-6">
<article class="card-body">
<h4 class="card-title mb-4 mt-1">Sign in</h4>
 <form>
    <div class="form-group">
    <label>Your Name</label>
        <input name="" class="form-control" placeholder="Type name here" type="text" v-model="sender">
    </div> 
    <div class="form-group">
        <button type="submit" class="btn btn-primary btn-block"  @click="nameChoice"> Login  </button>
    </div>                                                           
</form>
</article>
</div>
</div>`,
    methods: {
        nameChoice() {
            if (this.sender) {
                this.store.setSenderName(this.sender);
                this.store.setCurrentComponent('message-input')
            }
        }
    }
});

Vue.component('message-list', {
    props: ['messages'],
    template: `
<div class="message-list__container container overflow-auto">
    <message-component v-for="message in messages" :message="message"></message-component>
</div>`
});

Vue.component('chat-component', {
    data: function() {
        return {
            sharedData: store.state
        }
    },
    props: ['messages', 'system-messages'],
    template: `
<div class="chat__container container">
    <message-list v-if="sharedData.senderName" class="row  mh-75 d-inline-block" style="height: 900px" :messages="messages"></message-list>
<!--    <message-input v-if="senderName !== null" :ws="ws" :senderName="senderName"></message-input>-->
<!--    <message-name-choice v-if="senderName === null" :senderName="senderName"></message-name-choice>-->
<component :is="sharedData.currentComponent"></component>
</div>`
});


const app = new Vue({
    el: '#app',
    data: {
        messages: [],
        systemMessages: [],
        senderName: null,
        store: store
    },
    created: function () {
        const ws = new WebSocket('ws://' + location.host + '/app/chat');
        ws.onopen = () => {
        };
        ws.onmessage = (msg) => {
            const message = JSON.parse(msg.data);
            this.messages.push(message);
        };

        ws.onerror = () => {
            console.log("Error")
        };
        this.store.setWs(ws);
    }
});
