// Chinese Vocabulary Data — 部编版语文
// Structure mirrors data/vocabulary-data.js
// Each entry: { char, pinyin, meaning, meaningEn, example, examplePinyin, exampleMeaning }

const chineseVocabData = {
  books: {
    'grade2b': {
      title: '二年级下册',
      level: '小学二年级',
      description: '人教版部编语文二年级下册生字词',
      lessons: [
        // ── Unit 1 ────────────────────────────────────────────────
        {
          number: 1,
          unit: 1,
          title: '古诗二首',
          words: [
            {
              char: '诗',
              pinyin: 'shī',
              meaning: '用文字写成的韵文',
              meaningEn: 'poem; poetry',
              example: '诗歌',
              examplePinyin: 'shī gē',
              exampleMeaning: 'poem / poetry'
            },
            {
              char: '童',
              pinyin: 'tóng',
              meaning: '小孩子',
              meaningEn: 'child; children',
              example: '儿童',
              examplePinyin: 'ér tóng',
              exampleMeaning: 'children'
            },
            {
              char: '妆',
              pinyin: 'zhuāng',
              meaning: '打扮；装饰',
              meaningEn: 'to adorn; to dress up',
              example: '妆扮',
              examplePinyin: 'zhuāng bàn',
              exampleMeaning: 'to dress up / adorn'
            },
            {
              char: '丝',
              pinyin: 'sī',
              meaning: '细长的线状物；蚕丝',
              meaningEn: 'silk; thread; fine strand',
              example: '丝绸',
              examplePinyin: 'sī chóu',
              exampleMeaning: 'silk fabric'
            },
            {
              char: '村',
              pinyin: 'cūn',
              meaning: '农村；村庄',
              meaningEn: 'village; rural',
              example: '村庄',
              examplePinyin: 'cūn zhuāng',
              exampleMeaning: 'village'
            },
            {
              char: '碧',
              pinyin: 'bì',
              meaning: '青绿色；像玉一样的颜色',
              meaningEn: 'jade green; emerald',
              example: '碧绿',
              examplePinyin: 'bì lǜ',
              exampleMeaning: 'jade green'
            },
            {
              char: '绿',
              pinyin: 'lǜ',
              meaning: '草和树叶的颜色',
              meaningEn: 'green',
              example: '绿色',
              examplePinyin: 'lǜ sè',
              exampleMeaning: 'green (color)'
            },
            {
              char: '剪',
              pinyin: 'jiǎn',
              meaning: '用剪刀切断',
              meaningEn: 'to cut with scissors',
              example: '剪刀',
              examplePinyin: 'jiǎn dāo',
              exampleMeaning: 'scissors'
            },
          ]
        },
        {
          number: 2,
          unit: 1,
          title: '找春天',
          words: [
            {
              char: '冲',
              pinyin: 'chōng',
              meaning: '猛力向前；奔',
              meaningEn: 'to rush; to dash forward',
              example: '冲出',
              examplePinyin: 'chōng chū',
              exampleMeaning: 'to rush out'
            },
            {
              char: '姑',
              pinyin: 'gū',
              meaning: '父亲的姐妹；姑娘',
              meaningEn: "father's sister; girl",
              example: '姑娘',
              examplePinyin: 'gū niáng',
              exampleMeaning: 'girl; young woman'
            },
            {
              char: '吐',
              pinyin: 'tǔ',
              meaning: '从口中或内部冒出',
              meaningEn: 'to sprout; to spit out',
              example: '吐芽',
              examplePinyin: 'tǔ yá',
              exampleMeaning: 'to sprout buds'
            },
            {
              char: '荡',
              pinyin: 'dàng',
              meaning: '摇摆；飘动',
              meaningEn: 'to swing; to sway',
              example: '荡秋千',
              examplePinyin: 'dàng qiū qiān',
              exampleMeaning: 'to swing on a swing'
            },
            {
              char: '杏',
              pinyin: 'xìng',
              meaning: '一种春天开花的果树',
              meaningEn: 'apricot (tree/fruit)',
              example: '杏花',
              examplePinyin: 'xìng huā',
              exampleMeaning: 'apricot blossom'
            },
            {
              char: '寻',
              pinyin: 'xún',
              meaning: '找；搜索',
              meaningEn: 'to seek; to look for',
              example: '寻找',
              examplePinyin: 'xún zhǎo',
              exampleMeaning: 'to search / look for'
            },
            {
              char: '娘',
              pinyin: 'niáng',
              meaning: '女性；母亲的口语称呼',
              meaningEn: 'mother; woman; girl',
              example: '姑娘',
              examplePinyin: 'gū niáng',
              exampleMeaning: 'girl; young woman'
            },
            {
              char: '柳',
              pinyin: 'liǔ',
              meaning: '一种枝条细长的树',
              meaningEn: 'willow (tree)',
              example: '柳树',
              examplePinyin: 'liǔ shù',
              exampleMeaning: 'willow tree'
            },
            {
              char: '桃',
              pinyin: 'táo',
              meaning: '一种春天开花的果树',
              meaningEn: 'peach (tree/fruit)',
              example: '桃花',
              examplePinyin: 'táo huā',
              exampleMeaning: 'peach blossom'
            },
          ]
        },
        {
          number: 3,
          unit: 1,
          title: '开满鲜花的小路',
          words: [
            {
              char: '鲜',
              pinyin: 'xiān',
              meaning: '新鲜；鲜艳',
              meaningEn: 'fresh; bright; delicious',
              example: '鲜花',
              examplePinyin: 'xiān huā',
              exampleMeaning: 'fresh flowers'
            },
            {
              char: '递',
              pinyin: 'dì',
              meaning: '传送；交给',
              meaningEn: 'to pass; to hand over; to deliver',
              example: '递给',
              examplePinyin: 'dì gěi',
              exampleMeaning: 'to hand/pass to'
            },
            {
              char: '原',
              pinyin: 'yuán',
              meaning: '原来；本来',
              meaningEn: 'original; former; source',
              example: '原来',
              examplePinyin: 'yuán lái',
              exampleMeaning: 'originally; as it turns out'
            },
            {
              char: '局',
              pinyin: 'jú',
              meaning: '机构；部门',
              meaningEn: 'bureau; office; department',
              example: '邮局',
              examplePinyin: 'yóu jú',
              exampleMeaning: 'post office'
            },
            {
              char: '礼',
              pinyin: 'lǐ',
              meaning: '礼物；礼节',
              meaningEn: 'gift; courtesy; etiquette',
              example: '礼物',
              examplePinyin: 'lǐ wù',
              exampleMeaning: 'gift; present'
            },
            {
              char: '邮',
              pinyin: 'yóu',
              meaning: '邮寄；与邮政有关',
              meaningEn: 'mail; postal',
              example: '邮局',
              examplePinyin: 'yóu jú',
              exampleMeaning: 'post office'
            },
            {
              char: '员',
              pinyin: 'yuán',
              meaning: '从事某种工作的人',
              meaningEn: 'member; staff; employee',
              example: '邮递员',
              examplePinyin: 'yóu dì yuán',
              exampleMeaning: 'mail carrier; postman'
            },
            {
              char: '叔',
              pinyin: 'shū',
              meaning: '父亲的弟弟；男性长辈的称呼',
              meaningEn: "uncle (father's younger brother)",
              example: '叔叔',
              examplePinyin: 'shū shu',
              exampleMeaning: 'uncle'
            },
            {
              char: '堆',
              pinyin: 'duī',
              meaning: '堆积；一堆东西',
              meaningEn: 'pile; heap; to pile up',
              example: '一堆',
              examplePinyin: 'yī duī',
              exampleMeaning: 'a pile of'
            },
          ]
        },
        {
          number: 4,
          unit: 1,
          title: '邓小平爷爷植树',
          words: [
            {
              char: '邓',
              pinyin: 'dèng',
              meaning: '姓邓（邓小平的姓）',
              meaningEn: 'surname Deng',
              example: '邓小平',
              examplePinyin: 'Dèng Xiǎopíng',
              exampleMeaning: 'Deng Xiaoping'
            },
            {
              char: '格',
              pinyin: 'gé',
              meaning: '方格；规格；品格',
              meaningEn: 'grid; standard; character',
              example: '格外',
              examplePinyin: 'gé wài',
              exampleMeaning: 'especially; particularly'
            },
            {
              char: '注',
              pinyin: 'zhù',
              meaning: '注意；灌注',
              meaningEn: 'to pay attention; to pour into',
              example: '注意',
              examplePinyin: 'zhù yì',
              exampleMeaning: 'to pay attention; be careful'
            },
            {
              char: '休',
              pinyin: 'xiū',
              meaning: '休息；停止',
              meaningEn: 'to rest; to stop',
              example: '休息',
              examplePinyin: 'xiū xi',
              exampleMeaning: 'to rest; to take a break'
            },
            {
              char: '植',
              pinyin: 'zhí',
              meaning: '种植；植物',
              meaningEn: 'to plant; vegetation',
              example: '植树',
              examplePinyin: 'zhí shù',
              exampleMeaning: 'to plant trees'
            },
            {
              char: '引',
              pinyin: 'yǐn',
              meaning: '引导；带领',
              meaningEn: 'to lead; to guide; to attract',
              example: '引导',
              examplePinyin: 'yǐn dǎo',
              exampleMeaning: 'to guide; to lead'
            },
            {
              char: '满',
              pinyin: 'mǎn',
              meaning: '充满；全；达到限度',
              meaningEn: 'full; filled; satisfied',
              example: '满意',
              examplePinyin: 'mǎn yì',
              exampleMeaning: 'satisfied; pleased'
            },
            {
              char: '息',
              pinyin: 'xī',
              meaning: '休息；呼吸；消息',
              meaningEn: 'rest; breath; news',
              example: '休息',
              examplePinyin: 'xiū xi',
              exampleMeaning: 'to rest; to take a break'
            },
          ]
        },
        {
          number: 5,
          unit: 2,
          title: '雷锋叔叔，你在哪里',
          words: [
            {
              char: '锋',
              pinyin: 'fēng',
              meaning: '锋利；刀锋；先锋',
              meaningEn: 'sharp edge; vanguard',
              example: '雷锋',
              examplePinyin: 'Léi Fēng',
              exampleMeaning: 'Lei Feng (model soldier)'
            },
            {
              char: '冒',
              pinyin: 'mào',
              meaning: '顶着；冒出；冒险',
              meaningEn: 'to brave; to emit; to risk',
              example: '冒着',
              examplePinyin: 'mào zhe',
              exampleMeaning: 'braving; in the face of'
            },
            {
              char: '弯',
              pinyin: 'wān',
              meaning: '不直；弯曲',
              meaningEn: 'bend; curve; curved',
              example: '弯路',
              examplePinyin: 'wān lù',
              exampleMeaning: 'winding road'
            },
            {
              char: '洒',
              pinyin: 'sǎ',
              meaning: '液体散落；撒',
              meaningEn: 'to sprinkle; to spill',
              example: '洒下',
              examplePinyin: 'sǎ xià',
              exampleMeaning: 'to sprinkle down'
            },
            {
              char: '暖',
              pinyin: 'nuǎn',
              meaning: '温暖；不冷',
              meaningEn: 'warm; warmth',
              example: '温暖',
              examplePinyin: 'wēn nuǎn',
              exampleMeaning: 'warm; warmth'
            },
            {
              char: '昨',
              pinyin: 'zuó',
              meaning: '昨天；过去的',
              meaningEn: 'yesterday',
              example: '昨天',
              examplePinyin: 'zuó tiān',
              exampleMeaning: 'yesterday'
            },
            {
              char: '留',
              pinyin: 'liú',
              meaning: '留下；保留；停留',
              meaningEn: 'to stay; to leave behind; to keep',
              example: '留下',
              examplePinyin: 'liú xià',
              exampleMeaning: 'to leave behind; to stay'
            },
            {
              char: '背',
              pinyin: 'bēi',
              meaning: '背着；用背驮',
              meaningEn: 'to carry on the back',
              example: '背着',
              examplePinyin: 'bēi zhe',
              exampleMeaning: 'carrying on one\'s back'
            },
            {
              char: '温',
              pinyin: 'wēn',
              meaning: '温暖；温度；温和',
              meaningEn: 'warm; temperature; gentle',
              example: '温暖',
              examplePinyin: 'wēn nuǎn',
              exampleMeaning: 'warm; warmth'
            },
          ]
        },
        {
          number: 6,
          unit: 2,
          title: '千人糕',
          words: [
            {
              char: '能',
              pinyin: 'néng',
              meaning: '能够；有能力',
              meaningEn: 'can; able to; capable',
              example: '能力',
              examplePinyin: 'néng lì',
              exampleMeaning: 'ability; capability'
            },
            {
              char: '味',
              pinyin: 'wèi',
              meaning: '味道；气味',
              meaningEn: 'taste; flavor; smell',
              example: '味道',
              examplePinyin: 'wèi dào',
              exampleMeaning: 'taste; flavor'
            },
            {
              char: '具',
              pinyin: 'jù',
              meaning: '工具；器具',
              meaningEn: 'tool; implement; utensil',
              example: '农具',
              examplePinyin: 'nóng jù',
              exampleMeaning: 'farming tools'
            },
            {
              char: '甜',
              pinyin: 'tián',
              meaning: '像糖一样的味道',
              meaningEn: 'sweet',
              example: '甜蜜',
              examplePinyin: 'tián mì',
              exampleMeaning: 'sweet; honey-sweet'
            },
            {
              char: '劳',
              pinyin: 'láo',
              meaning: '劳动；辛苦',
              meaningEn: 'labor; toil; to work hard',
              example: '劳动',
              examplePinyin: 'láo dòng',
              exampleMeaning: 'labor; to work'
            },
            {
              char: '桌',
              pinyin: 'zhuō',
              meaning: '桌子；台子',
              meaningEn: 'table; desk',
              example: '桌子',
              examplePinyin: 'zhuō zi',
              exampleMeaning: 'table; desk'
            },
            {
              char: '买',
              pinyin: 'mǎi',
              meaning: '付钱得到东西',
              meaningEn: 'to buy; to purchase',
              example: '买东西',
              examplePinyin: 'mǎi dōng xi',
              exampleMeaning: 'to buy things; to shop'
            },
            {
              char: '甘',
              pinyin: 'gān',
              meaning: '甜；甘蔗',
              meaningEn: 'sweet; willing; sugarcane',
              example: '甘蔗',
              examplePinyin: 'gān zhè',
              exampleMeaning: 'sugar cane'
            },
            {
              char: '菜',
              pinyin: 'cài',
              meaning: '蔬菜；菜肴',
              meaningEn: 'vegetable; dish; food',
              example: '蔬菜',
              examplePinyin: 'shū cài',
              exampleMeaning: 'vegetables'
            },
          ]
        },
        {
          number: 7,
          unit: 2,
          title: '一匹出色的马',
          words: [
            {
              char: '匹',
              pinyin: 'pǐ',
              meaning: '量词，用于马；相当；匹配',
              meaningEn: 'measure word for horses; to match',
              example: '一匹马',
              examplePinyin: 'yī pǐ mǎ',
              exampleMeaning: 'a horse'
            },
            {
              char: '波',
              pinyin: 'bō',
              meaning: '水波；波浪',
              meaningEn: 'wave; ripple',
              example: '波浪',
              examplePinyin: 'bō làng',
              exampleMeaning: 'waves'
            },
            {
              char: '像',
              pinyin: 'xiàng',
              meaning: '好像；相似；图像',
              meaningEn: 'to resemble; like; image',
              example: '好像',
              examplePinyin: 'hǎo xiàng',
              exampleMeaning: 'seems like; as if'
            },
            {
              char: '恋',
              pinyin: 'liàn',
              meaning: '留恋；依恋；爱恋',
              meaningEn: 'to be attached to; to love; to long for',
              example: '留恋',
              examplePinyin: 'liú liàn',
              exampleMeaning: 'reluctant to leave; to feel attached'
            },
            {
              char: '求',
              pinyin: 'qiú',
              meaning: '请求；要求；寻求',
              meaningEn: 'to beg; to request; to seek',
              example: '请求',
              examplePinyin: 'qǐng qiú',
              exampleMeaning: 'to request; to ask'
            },
            {
              char: '妹',
              pinyin: 'mèi',
              meaning: '年幼的女性兄弟姐妹',
              meaningEn: 'younger sister',
              example: '妹妹',
              examplePinyin: 'mèi mei',
              exampleMeaning: 'younger sister'
            },
            {
              char: '纹',
              pinyin: 'wén',
              meaning: '花纹；纹路',
              meaningEn: 'pattern; veins; lines',
              example: '波纹',
              examplePinyin: 'bō wén',
              exampleMeaning: 'ripples; wave pattern'
            },
            {
              char: '景',
              pinyin: 'jǐng',
              meaning: '景色；风景',
              meaningEn: 'scenery; view; scene',
              example: '风景',
              examplePinyin: 'fēng jǐng',
              exampleMeaning: 'scenery; landscape'
            },
            {
              char: '舍',
              pinyin: 'shě',
              meaning: '舍不得；放弃',
              meaningEn: 'to be reluctant to give up; to abandon',
              example: '舍不得',
              examplePinyin: 'shě bu dé',
              exampleMeaning: 'reluctant to part with'
            },
          ]
        },

        // ── Unit 2 ────────────────────────────────────────────────
        {
          number: 1,
          unit: 2,
          title: '神州谣',
          words: [
            {
              char: '州',
              pinyin: 'zhōu',
              meaning: '地区；行政区划',
              meaningEn: 'prefecture; region; state',
              example: '神州',
              examplePinyin: 'shén zhōu',
              exampleMeaning: 'China (poetic name)'
            },
            {
              char: '岛',
              pinyin: 'dǎo',
              meaning: '四面环水的陆地',
              meaningEn: 'island',
              example: '岛屿',
              examplePinyin: 'dǎo yǔ',
              exampleMeaning: 'islands'
            },
            {
              char: '民',
              pinyin: 'mín',
              meaning: '人民；百姓',
              meaningEn: 'people; citizens',
              example: '人民',
              examplePinyin: 'rén mín',
              exampleMeaning: 'the people'
            },
            {
              char: '谊',
              pinyin: 'yì',
              meaning: '友好的情意',
              meaningEn: 'friendship; goodwill',
              example: '友谊',
              examplePinyin: 'yǒu yì',
              exampleMeaning: 'friendship'
            },
            {
              char: '奋',
              pinyin: 'fèn',
              meaning: '振奋；努力向上',
              meaningEn: 'to strive; to exert oneself',
              example: '奋发',
              examplePinyin: 'fèn fā',
              exampleMeaning: 'to work hard; to strive'
            },
            {
              char: '华',
              pinyin: 'huá',
              meaning: '华夏；中华；繁华',
              meaningEn: 'China; magnificent; splendid',
              example: '中华',
              examplePinyin: 'zhōng huá',
              exampleMeaning: 'China; Chinese nation'
            },
            {
              char: '峡',
              pinyin: 'xiá',
              meaning: '两山之间的狭窄通道',
              meaningEn: 'gorge; strait; canyon',
              example: '三峡',
              examplePinyin: 'Sān Xiá',
              exampleMeaning: 'Three Gorges'
            },
            {
              char: '族',
              pinyin: 'zú',
              meaning: '民族；家族',
              meaningEn: 'ethnic group; clan; nationality',
              example: '民族',
              examplePinyin: 'mín zú',
              exampleMeaning: 'ethnic group; nationality'
            },
            {
              char: '齐',
              pinyin: 'qí',
              meaning: '整齐；一起；共同',
              meaningEn: 'together; in unison; neat',
              example: '齐心',
              examplePinyin: 'qí xīn',
              exampleMeaning: 'of one mind; united'
            },
          ]
        },
        {
          number: 2,
          unit: 2,
          title: '传统节日',
          words: []
        },
        {
          number: 3,
          unit: 2,
          title: '"贝"的故事',
          words: []
        },
        {
          number: 4,
          unit: 2,
          title: '中国美食',
          words: []
        },

        // ── Unit 4 ────────────────────────────────────────────────
        {
          number: 12,
          unit: 4,
          title: '小马过河',
          words: []
        },
        {
          number: 13,
          unit: 4,
          title: '画杨桃',
          words: []
        },
        {
          number: 14,
          unit: 4,
          title: '小毛虫',
          words: []
        },

        // ── Unit 5 ────────────────────────────────────────────────
        {
          number: 15,
          unit: 5,
          title: '古诗二首',
          words: []
        },
        {
          number: 16,
          unit: 5,
          title: '"贝"的故事',
          words: []
        },
        {
          number: 17,
          unit: 5,
          title: '祖先的摇篮',
          words: []
        },
        {
          number: 18,
          unit: 5,
          title: '我是一只小虫子',
          words: []
        },

        // ── Unit 6 ────────────────────────────────────────────────
        {
          number: 19,
          unit: 6,
          title: '古诗二首',
          words: []
        },
        {
          number: 20,
          unit: 6,
          title: '蜘蛛开店',
          words: []
        },
        {
          number: 21,
          unit: 6,
          title: '青蛙卖泥塘',
          words: []
        },
        {
          number: 22,
          unit: 6,
          title: '雷雨',
          words: []
        },

        // ── Unit 7 ────────────────────────────────────────────────
        {
          number: 23,
          unit: 7,
          title: '古诗二首',
          words: []
        },
        {
          number: 24,
          unit: 7,
          title: '大象的耳朵',
          words: []
        },
        {
          number: 25,
          unit: 7,
          title: '羿射九日',
          words: []
        },
        {
          number: 26,
          unit: 7,
          title: '蜗牛的奖杯',
          words: []
        },

        // ── Unit 8 ────────────────────────────────────────────────
        {
          number: 27,
          unit: 8,
          title: '古诗二首',
          words: []
        },
        {
          number: 28,
          unit: 8,
          title: '真正的英雄',
          words: []
        },
        {
          number: 29,
          unit: 8,
          title: '数星星的孩子',
          words: []
        },
        {
          number: 30,
          unit: 8,
          title: '爱迪生救妈妈',
          words: []
        },
      ]
    }
  }
};

// ── Helpers ──────────────────────────────────────────────────────────────────

/** Return a lesson by lesson number */
function getCNLesson(lessonNumber) {
  return chineseVocabData.books['grade2b'].lessons.find(l => l.number === lessonNumber) || null;
}

/** Return all lessons for a given unit number */
function getCNUnit(unitNumber) {
  return chineseVocabData.books['grade2b'].lessons.filter(l => l.unit === unitNumber);
}

/** Return every word across all lessons (flat array) */
function getAllCNWords() {
  return chineseVocabData.books['grade2b'].lessons.flatMap(l => l.words);
}
