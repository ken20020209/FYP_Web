<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useMessage } from 'naive-ui';
import type { Controller } from '@/robot/Controller';

// const { curController } = useConnectorStore();

const message = useMessage();

interface Props {
  controller: Controller;
}
interface ControllerMap {
  [key: string]: {
    func: () => void;
    keywords: string[];
  };
}
const props = defineProps<Props>();
const useGPT = ref(false);
const OPENAI_API_KEY = ref('');

const { controller } = props;

const transcript = ref('');
const isRecording = ref(false);

const Recognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
const sr = new Recognition();

const controllerMap: ControllerMap = {};

controllerMap.forward = {
  func: () => controller.movement.move_forward(),
  keywords: ['forward', 'go forward', 'move forward']
};

controllerMap.backward = {
  func: () => controller.movement.move_backward(),
  keywords: ['backward', 'go backward', 'move backward']
};

controllerMap.left = {
  func: () => controller.movement.move_left(),
  keywords: ['go left', 'move left']
};

controllerMap.right = {
  func: () => controller.movement.move_right(),
  keywords: ['go right', 'move right']
};

controllerMap.stop = {
  func: () => controller.movement.stop(),
  keywords: ['stop']
};

controllerMap.turn_left = {
  func: () => controller.movement.turn_left(),
  keywords: ['turn left']
};

controllerMap.turn_right = {
  func: () => controller.movement.turn_right(),
  keywords: ['turn right']
};
let GPT_prompt = `your software engineer assistant , you need to back javascript code to execute the command, Do not provide any explanations. Do not respond with anything except the code. The below is the code is use to control robot(dog,spider,muto)`;

GPT_prompt += `You give api same as bellow:`;

GPT_prompt += `API list:`;

// display
GPT_prompt += ` the display list is:`;

GPT_prompt += ` message.success(msg:string);`;
GPT_prompt += ` message.error(msg:string);`;
GPT_prompt += ` message.info(msg:string);`;
GPT_prompt += ` message.warning(msg:string);`;
// movememnt
GPT_prompt += ` The movement list is:`;

GPT_prompt += ` controller.movement.move_forward();`;
GPT_prompt += ` controller.movement.move_backward();`;
GPT_prompt += ` controller.movement.move_left();`;
GPT_prompt += ` controller.movement.move_right();`;
GPT_prompt += ` controller.movement.stop();`;
GPT_prompt += ` controller.movement.turn_left();`;
GPT_prompt += ` controller.movement.turn_right();`;

GPT_prompt += ` the action list is :`;
// action
for (const key of Object.keys(controller.action.actionList)) {
  GPT_prompt += ` controller.action.actionList.${key}();`;
}
// console.log(GPT_prompt);

const GPT_message = [
  {
    role: 'system',
    content: GPT_prompt
  },
  {
    role: 'user',
    content: 'i want the robot to forward'
  },
  {
    role: 'assistant',
    content: 'controller.movement.move_forward();'
  },
  {
    role: 'user',
    content: ' i want robot lie down'
  },
  {
    role: 'assistant',
    content: 'controller.action.actionList.lie_down();'
  },
  {
    role: 'user',
    content: ' stand up'
  },
  {
    role: 'assistant',
    content: 'controller.action.actionList.stand_up();'
  }
];

const gptOutput = ref('');
const fetchGPT3 = async (text: string) => {
  const prompt = ` ${text}`;
  const sendMessage = [
    ...GPT_message,
    {
      role: 'user',
      content: prompt
    }
  ];
  // console.log(sendMessage);
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      authorization: `Bearer ${OPENAI_API_KEY.value}`
    },
    body: JSON.stringify({
      model: 'gpt-4-turbo',
      messages: sendMessage
    })
  });
  const response = await res.json();

  const result = response.choices[0].message.content;
  gptOutput.value = result;
  return result;
};

const executeCMD = async (text?: string) => {
  // console.log(text);
  if (text) {
    transcript.value = text;
  }
  const cmd = await fetchGPT3(transcript.value);
  let code = '';
  // try catch block
  code += 'try {';
  // code += 'controller.movement.move_forward();'; // cant repalce code gen by gpt-3
  code += cmd;
  code += ';message.success("executed success");';
  code += '} catch (e) {';
  code += 'message.error("executed failed");';
  code += '}';

  // eslint-disable-next-line no-eval
  eval(code);
};

const matchController = (t: string) => {
  for (const [key, value] of Object.entries(controllerMap)) {
    if (value.keywords.some(k => t.includes(k))) {
      return key;
    }
  }
  return '';
};

const CheckForCommand = (result: any[]) => {
  const t = result[0].transcript.toLowerCase();
  // message.info(`Transcript: ${t}`);
  const key = matchController(t);
  if (t.includes('reset')) {
    sr.stop();
    setTimeout(() => {
      sr.start();
    }, 500);
  }
  if (t.includes('69')) {
    // remove the keyword
    sr.stop();

    const text = transcript.value.replace('69', '');
    executeCMD(text);
    setTimeout(() => {
      sr.start();
    }, 500);
  }
  if (key) {
    sr.stop();
    message.success(`Command: ${key}`);
    controllerMap[key].func();
    setTimeout(() => {
      sr.start();
    }, 500);
  }
};

onMounted(() => {
  sr.continuous = true;
  sr.interimResults = true;

  sr.onstart = () => {
    // message.info('SR Started');
    isRecording.value = true;
  };

  sr.onend = () => {
    // message.info('SR Stopped');
    isRecording.value = false;
    transcript.value = '';
  };

  sr.onresult = (evt: any) => {
    for (let i = 0; i < evt.results.length; i += 1) {
      const result = evt.results[i];

      if (result.isFinal) CheckForCommand(result);
    }

    const t = Array.from(evt.results)
      .map(result => (result as any)[0])
      .map(result => result.transcript)
      .join('');

    transcript.value = t;
  };
});

const ToggleMic = () => {
  if (!isRecording.value) {
    sr.stop();
  } else {
    sr.start();
  }
};
const options = [
  {
    label: 'cantonese',
    key: 'zh-HK'
  },
  {
    label: 'english',
    key: 'en-US'
  },
  {
    label: 'chinese',
    key: 'zh-CN'
  },
  {
    label: 'japanese',
    key: 'ja-JP'
  },
  {
    label: 'korean',
    key: 'ko-KR'
  }
];
const handleSelect = (key: string) => {
  sr.lang = key;
};
</script>

<template>
  <NCard title="Voice Control">
    <NDropdown :options="options" @select="handleSelect">
      <NButton>Choose lang {{ sr.lang }}</NButton>
    </NDropdown>
    <NSwitch v-model:value="isRecording" @update-value="ToggleMic"></NSwitch>
    Voice Record Switch

    <NInput v-model:value="transcript" placeholder="Transcript" readonly></NInput>

    <NSwitch v-model:value="useGPT"></NSwitch>
    GPT Switch
    <div v-show="useGPT">
      <NInput v-model:value="OPENAI_API_KEY" placeholder="api key" type="password"></NInput>
      <NInput v-model:value="gptOutput" placeholder="gptOutput" readonly></NInput>
      <NButton type="error" @click="executeCMD('')">Execute CMD</NButton>
    </div>
  </NCard>
</template>
