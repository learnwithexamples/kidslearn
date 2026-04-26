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
          words: [
            {
              char: '贴',
              pinyin: 'tiē',
              meaning: '粘上；紧靠',
              meaningEn: 'to paste; to stick; to post',
              example: '贴春联',
              examplePinyin: 'tiē chūn lián',
              exampleMeaning: 'to post Spring Festival couplets'
            },
            {
              char: '舟',
              pinyin: 'zhōu',
              meaning: '船；小船',
              meaningEn: 'boat; vessel',
              example: '龙舟',
              examplePinyin: 'lóng zhōu',
              exampleMeaning: 'dragon boat'
            },
            {
              char: '敬',
              pinyin: 'jìng',
              meaning: '尊敬；恭敬',
              meaningEn: 'to respect; to honor',
              example: '敬老',
              examplePinyin: 'jìng lǎo',
              exampleMeaning: 'to respect the elderly'
            },
            {
              char: '团',
              pinyin: 'tuán',
              meaning: '团圆；聚在一起；圆形',
              meaningEn: 'reunion; group; round',
              example: '团圆',
              examplePinyin: 'tuán yuán',
              exampleMeaning: 'family reunion'
            },
            {
              char: '闹',
              pinyin: 'nào',
              meaning: '热闹；吵闹；闹腾',
              meaningEn: 'noisy; lively; to make noise',
              example: '热闹',
              examplePinyin: 'rè nào',
              exampleMeaning: 'lively; bustling'
            },
            {
              char: '街',
              pinyin: 'jiē',
              meaning: '街道；马路',
              meaningEn: 'street; road',
              example: '大街',
              examplePinyin: 'dà jiē',
              exampleMeaning: 'main street; avenue'
            },
            {
              char: '艾',
              pinyin: 'ài',
              meaning: '艾草；一种草本植物',
              meaningEn: 'moxa; mugwort (herb)',
              example: '艾草',
              examplePinyin: 'ài cǎo',
              exampleMeaning: 'mugwort; moxa herb'
            },
            {
              char: '转',
              pinyin: 'zhuǎn',
              meaning: '转动；改变方向',
              meaningEn: 'to turn; to rotate; to change direction',
              example: '转眼',
              examplePinyin: 'zhuǎn yǎn',
              exampleMeaning: 'in the blink of an eye'
            },
            {
              char: '热',
              pinyin: 'rè',
              meaning: '温度高；热闹；热情',
              meaningEn: 'hot; heat; enthusiastic',
              example: '热闹',
              examplePinyin: 'rè nào',
              exampleMeaning: 'lively; bustling'
            },
          ]
        },
        {
          number: 3,
          unit: 2,
          title: '"贝"的故事',
          words: [
            {
              char: '贝',
              pinyin: 'bèi',
              meaning: '贝壳；古代用作货币',
              meaningEn: 'shell; cowrie (ancient currency)',
              example: '贝壳',
              examplePinyin: 'bèi ké',
              exampleMeaning: 'seashell'
            },
            {
              char: '甲',
              pinyin: 'jiǎ',
              meaning: '第一；甲骨；盔甲',
              meaningEn: 'first; shell; armor; oracle bone',
              example: '甲骨文',
              examplePinyin: 'jiǎ gǔ wén',
              exampleMeaning: 'oracle bone script'
            },
            {
              char: '钱',
              pinyin: 'qián',
              meaning: '金钱；货币',
              meaningEn: 'money; cash; currency',
              example: '钱币',
              examplePinyin: 'qián bì',
              exampleMeaning: 'coins; currency'
            },
            {
              char: '与',
              pinyin: 'yǔ',
              meaning: '和；跟；给',
              meaningEn: 'and; with; to give',
              example: '与其',
              examplePinyin: 'yǔ qí',
              exampleMeaning: 'rather than'
            },
            {
              char: '关',
              pinyin: 'guān',
              meaning: '关系；关闭；有关',
              meaningEn: 'relation; to close; related to',
              example: '有关',
              examplePinyin: 'yǒu guān',
              exampleMeaning: 'related to; about'
            },
            {
              char: '壳',
              pinyin: 'ké',
              meaning: '外壳；硬的外皮',
              meaningEn: 'shell; hard outer covering',
              example: '贝壳',
              examplePinyin: 'bèi ké',
              exampleMeaning: 'seashell'
            },
            {
              char: '骨',
              pinyin: 'gǔ',
              meaning: '骨头；骨骼',
              meaningEn: 'bone; skeleton',
              example: '甲骨',
              examplePinyin: 'jiǎ gǔ',
              exampleMeaning: 'oracle bones (turtle shell & animal bone)'
            },
            {
              char: '币',
              pinyin: 'bì',
              meaning: '货币；钱',
              meaningEn: 'currency; coin; money',
              example: '人民币',
              examplePinyin: 'rén mín bì',
              exampleMeaning: 'RMB (Chinese currency)'
            },
            {
              char: '财',
              pinyin: 'cái',
              meaning: '财富；钱财',
              meaningEn: 'wealth; riches; money',
              example: '财富',
              examplePinyin: 'cái fù',
              exampleMeaning: 'wealth; riches'
            },
          ]
        },
        // ── Unit 3 ────────────────────────────────────────────────
        {
          number: 8,
          unit: 3,
          title: '彩色的梦',
          words: [
            {
              char: '彩',
              pinyin: 'cǎi',
              meaning: '颜色；彩色；精彩',
              meaningEn: 'color; colorful; brilliant',
              example: '彩色',
              examplePinyin: 'cǎi sè',
              exampleMeaning: 'colorful; multicolored'
            },
            {
              char: '森',
              pinyin: 'sēn',
              meaning: '树木众多；森林',
              meaningEn: 'forest; densely wooded',
              example: '森林',
              examplePinyin: 'sēn lín',
              exampleMeaning: 'forest'
            },
            {
              char: '结',
              pinyin: 'jié',
              meaning: '结果；结束；打结',
              meaningEn: 'to bear fruit; to knot; result',
              example: '结果',
              examplePinyin: 'jié guǒ',
              exampleMeaning: 'result; to bear fruit'
            },
            {
              char: '般',
              pinyin: 'bān',
              meaning: '一样；如同；种类',
              meaningEn: 'like; as if; sort; kind',
              example: '一般',
              examplePinyin: 'yī bān',
              exampleMeaning: 'ordinary; in general; like'
            },
            {
              char: '灵',
              pinyin: 'líng',
              meaning: '灵活；心灵；神灵',
              meaningEn: 'quick; clever; spirit; soul',
              example: '灵气',
              examplePinyin: 'líng qì',
              exampleMeaning: 'spirit; liveliness; cleverness'
            },
            {
              char: '梦',
              pinyin: 'mèng',
              meaning: '梦想；做梦',
              meaningEn: 'dream',
              example: '梦想',
              examplePinyin: 'mèng xiǎng',
              exampleMeaning: 'dream; aspiration'
            },
            {
              char: '拉',
              pinyin: 'lā',
              meaning: '拉动；拖；拉开',
              meaningEn: 'to pull; to drag; to draw',
              example: '拉开',
              examplePinyin: 'lā kāi',
              exampleMeaning: 'to pull open; to stretch apart'
            },
            {
              char: '苹',
              pinyin: 'píng',
              meaning: '苹果（植物名）',
              meaningEn: 'apple (used in 苹果)',
              example: '苹果',
              examplePinyin: 'píng guǒ',
              exampleMeaning: 'apple'
            },
            {
              char: '精',
              pinyin: 'jīng',
              meaning: '精彩；精灵；精细',
              meaningEn: 'excellent; spirit; refined; essence',
              example: '精灵',
              examplePinyin: 'jīng líng',
              exampleMeaning: 'elf; sprite; clever creature'
            },
          ]
        },
        {
          number: 9,
          unit: 3,
          title: '枫树上的喜鹊',
          words: [
            {
              char: '伞',
              pinyin: 'sǎn',
              meaning: '雨伞；遮雨或遮阳的工具',
              meaningEn: 'umbrella; parasol',
              example: '雨伞',
              examplePinyin: 'yǔ sǎn',
              exampleMeaning: 'umbrella'
            },
            {
              char: '弟',
              pinyin: 'dì',
              meaning: '弟弟；年幼的兄弟',
              meaningEn: 'younger brother',
              example: '弟弟',
              examplePinyin: 'dì di',
              exampleMeaning: 'younger brother'
            },
            {
              char: '教',
              pinyin: 'jiāo',
              meaning: '教导；传授知识',
              meaningEn: 'to teach; to instruct',
              example: '教导',
              examplePinyin: 'jiāo dǎo',
              exampleMeaning: 'to teach; to guide'
            },
            {
              char: '戏',
              pinyin: 'xì',
              meaning: '游戏；玩耍；戏剧',
              meaningEn: 'play; game; drama',
              example: '游戏',
              examplePinyin: 'yóu xì',
              exampleMeaning: 'game; to play'
            },
            {
              char: '姨',
              pinyin: 'yí',
              meaning: '母亲的姐妹；阿姨',
              meaningEn: "mother's sister; auntie",
              example: '阿姨',
              examplePinyin: 'ā yí',
              exampleMeaning: 'auntie; adult woman'
            },
            {
              char: '便',
              pinyin: 'biàn',
              meaning: '方便；就；顺便',
              meaningEn: 'convenient; then; so',
              example: '方便',
              examplePinyin: 'fāng biàn',
              exampleMeaning: 'convenient; handy'
            },
            {
              char: '游',
              pinyin: 'yóu',
              meaning: '游泳；游览；游玩',
              meaningEn: 'to swim; to travel; to play',
              example: '游玩',
              examplePinyin: 'yóu wán',
              exampleMeaning: 'to play; to have fun'
            },
            {
              char: '母',
              pinyin: 'mǔ',
              meaning: '妈妈；母亲',
              meaningEn: 'mother',
              example: '母亲',
              examplePinyin: 'mǔ qīn',
              exampleMeaning: 'mother'
            },
          ]
        },
        {
          number: 10,
          unit: 3,
          title: '沙滩上的童话',
          words: [
            {
              char: '周',
              pinyin: 'zhōu',
              meaning: '周围；一周；姓周',
              meaningEn: 'around; week; circumference',
              example: '周围',
              examplePinyin: 'zhōu wéi',
              exampleMeaning: 'surroundings; around'
            },
            {
              char: '句',
              pinyin: 'jù',
              meaning: '句子；语言单位',
              meaningEn: 'sentence; phrase',
              example: '句子',
              examplePinyin: 'jù zi',
              exampleMeaning: 'sentence'
            },
            {
              char: '充',
              pinyin: 'chōng',
              meaning: '充满；充实；填充',
              meaningEn: 'to fill; full; sufficient',
              example: '充满',
              examplePinyin: 'chōng mǎn',
              exampleMeaning: 'filled with; full of'
            },
            {
              char: '合',
              pinyin: 'hé',
              meaning: '合在一起；合适；符合',
              meaningEn: 'to combine; suitable; to fit',
              example: '合力',
              examplePinyin: 'hé lì',
              exampleMeaning: 'to join forces; combined strength'
            },
            {
              char: '记',
              pinyin: 'jì',
              meaning: '记住；记录',
              meaningEn: 'to remember; to record',
              example: '记住',
              examplePinyin: 'jì zhù',
              exampleMeaning: 'to remember; to keep in mind'
            },
            {
              char: '围',
              pinyin: 'wéi',
              meaning: '包围；周围；围绕',
              meaningEn: 'to surround; around; encircle',
              example: '包围',
              examplePinyin: 'bāo wéi',
              exampleMeaning: 'to surround; to encircle'
            },
            {
              char: '补',
              pinyin: 'bǔ',
              meaning: '修补；补充；弥补',
              meaningEn: 'to patch; to supplement; to make up for',
              example: '补充',
              examplePinyin: 'bǔ chōng',
              exampleMeaning: 'to supplement; to add'
            },
            {
              char: '药',
              pinyin: 'yào',
              meaning: '药物；医药',
              meaningEn: 'medicine; drug',
              example: '药物',
              examplePinyin: 'yào wù',
              exampleMeaning: 'medicine; drugs'
            },
            {
              char: '死',
              pinyin: 'sǐ',
              meaning: '死亡；不能动',
              meaningEn: 'to die; dead',
              example: '死去',
              examplePinyin: 'sǐ qù',
              exampleMeaning: 'to die; to pass away'
            },
          ]
        },
        {
          number: 11,
          unit: 3,
          title: '我是一只小虫子',
          words: [
            {
              char: '屁',
              pinyin: 'pì',
              meaning: '屁股；放屁',
              meaningEn: 'fart; bottom (informal)',
              example: '放屁',
              examplePinyin: 'fàng pì',
              exampleMeaning: 'to fart'
            },
            {
              char: '股',
              pinyin: 'gǔ',
              meaning: '屁股；大腿部分',
              meaningEn: 'buttocks; thigh; portion',
              example: '屁股',
              examplePinyin: 'pì gu',
              exampleMeaning: 'bottom; buttocks'
            },
            {
              char: '尿',
              pinyin: 'niào',
              meaning: '小便；排泄液体',
              meaningEn: 'urine; to urinate',
              example: '尿尿',
              examplePinyin: 'niào niào',
              exampleMeaning: 'to pee (child speech)'
            },
            {
              char: '净',
              pinyin: 'jìng',
              meaning: '干净；清洁',
              meaningEn: 'clean; pure; only',
              example: '干净',
              examplePinyin: 'gān jìng',
              exampleMeaning: 'clean; tidy'
            },
            {
              char: '屎',
              pinyin: 'shǐ',
              meaning: '粪便；排泄物',
              meaningEn: 'excrement; feces',
              example: '粪屎',
              examplePinyin: 'fèn shǐ',
              exampleMeaning: 'dung; droppings'
            },
            {
              char: '幸',
              pinyin: 'xìng',
              meaning: '幸运；幸福',
              meaningEn: 'lucky; fortunate; happiness',
              example: '幸运',
              examplePinyin: 'xìng yùn',
              exampleMeaning: 'lucky; fortunate'
            },
            {
              char: '使',
              pinyin: 'shǐ',
              meaning: '使用；让；派遣',
              meaningEn: 'to use; to make; to send',
              example: '使劲',
              examplePinyin: 'shǐ jìn',
              exampleMeaning: 'to exert force; to try hard'
            },
            {
              char: '劲',
              pinyin: 'jìn',
              meaning: '力气；劲头；使劲',
              meaningEn: 'strength; energy; effort',
              example: '使劲',
              examplePinyin: 'shǐ jìn',
              exampleMeaning: 'to exert force; to try hard'
            },
          ]
        },
        {
          number: 12,
          unit: 3,
          title: '寓言二则',
          words: [
            {
              char: '亡',
              pinyin: 'wáng',
              meaning: '丢失；死亡；逃跑',
              meaningEn: 'to lose; to die; to flee',
              example: '亡羊补牢',
              examplePinyin: 'wáng yáng bǔ láo',
              exampleMeaning: 'mend the pen after the sheep is lost'
            },
            {
              char: '牢',
              pinyin: 'láo',
              meaning: '牢固；牢笼；羊圈',
              meaningEn: 'firm; pen; enclosure; jail',
              example: '羊牢',
              examplePinyin: 'yáng láo',
              exampleMeaning: 'sheep pen'
            },
            {
              char: '钻',
              pinyin: 'zuān',
              meaning: '钻进；穿过；钻孔',
              meaningEn: 'to drill; to bore through; to get into',
              example: '钻进',
              examplePinyin: 'zuān jìn',
              exampleMeaning: 'to drill/squeeze into'
            },
            {
              char: '劝',
              pinyin: 'quàn',
              meaning: '劝说；劝告',
              meaningEn: 'to advise; to persuade',
              example: '劝告',
              examplePinyin: 'quàn gào',
              exampleMeaning: 'to advise; advice'
            },
            {
              char: '丢',
              pinyin: 'diū',
              meaning: '丢失；失去',
              meaningEn: 'to lose; to throw away',
              example: '丢失',
              examplePinyin: 'diū shī',
              exampleMeaning: 'to lose; to misplace'
            },
            {
              char: '告',
              pinyin: 'gào',
              meaning: '告诉；报告；劝告',
              meaningEn: 'to tell; to inform; to report',
              example: '告诉',
              examplePinyin: 'gào sù',
              exampleMeaning: 'to tell; to inform'
            },
            {
              char: '筋',
              pinyin: 'jīn',
              meaning: '筋疲力尽；肌肉；筋骨',
              meaningEn: 'muscle; tendon; sinew',
              example: '筋疲力尽',
              examplePinyin: 'jīn pí lì jìn',
              exampleMeaning: 'exhausted; worn out'
            },
            {
              char: '疲',
              pinyin: 'pí',
              meaning: '疲惫；疲劳；累',
              meaningEn: 'tired; weary; exhausted',
              example: '疲劳',
              examplePinyin: 'pí láo',
              exampleMeaning: 'fatigue; tired'
            },
          ]
        },
        {
          number: 13,
          unit: 3,
          title: '画杨桃',
          words: [
            {
              char: '图',
              pinyin: 'tú',
              meaning: '图画；地图；图形',
              meaningEn: 'picture; map; diagram',
              example: '图画',
              examplePinyin: 'tú huà',
              exampleMeaning: 'drawing; picture'
            },
            {
              char: '课',
              pinyin: 'kè',
              meaning: '课堂；上课；课程',
              meaningEn: 'class; lesson; course',
              example: '上课',
              examplePinyin: 'shàng kè',
              exampleMeaning: 'to attend class'
            },
            {
              char: '摆',
              pinyin: 'bǎi',
              meaning: '放置；摆动；陈列',
              meaningEn: 'to place; to arrange; to swing',
              example: '摆放',
              examplePinyin: 'bǎi fàng',
              exampleMeaning: 'to place; to arrange'
            },
            {
              char: '座',
              pinyin: 'zuò',
              meaning: '座位；位置',
              meaningEn: 'seat; base; measure word for large objects',
              example: '座位',
              examplePinyin: 'zuò wèi',
              exampleMeaning: 'seat; place'
            },
            {
              char: '室',
              pinyin: 'shì',
              meaning: '房间；教室；办公室',
              meaningEn: 'room; chamber; office',
              example: '教室',
              examplePinyin: 'jiào shì',
              exampleMeaning: 'classroom'
            },
            {
              char: '交',
              pinyin: 'jiāo',
              meaning: '交给；交叉；交朋友',
              meaningEn: 'to hand over; to cross; to make friends',
              example: '交给',
              examplePinyin: 'jiāo gěi',
              exampleMeaning: 'to hand over to'
            },
            {
              char: '哈',
              pinyin: 'hā',
              meaning: '笑声；哈哈大笑',
              meaningEn: 'ha (laughing sound)',
              example: '哈哈',
              examplePinyin: 'hā hā',
              exampleMeaning: 'haha (laughter)'
            },
            {
              char: '页',
              pinyin: 'yè',
              meaning: '书页；页面',
              meaningEn: 'page (of a book)',
              example: '页面',
              examplePinyin: 'yè miàn',
              exampleMeaning: 'page; screen'
            },
            {
              char: '抢',
              pinyin: 'qiǎng',
              meaning: '抢先；争夺；抢答',
              meaningEn: 'to snatch; to grab; to compete',
              example: '抢着',
              examplePinyin: 'qiǎng zhe',
              exampleMeaning: 'eagerly competing to'
            },
            {
              char: '嘻',
              pinyin: 'xī',
              meaning: '嘻嘻；笑声',
              meaningEn: 'hee hee (giggling sound)',
              example: '嘻嘻',
              examplePinyin: 'xī xī',
              exampleMeaning: 'hee hee (giggling)'
            },
          ]
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
