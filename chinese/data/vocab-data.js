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
              exampleMeaning: 'poem / poetry',
              examples: ["诗歌","古诗","诗人"]
            },
            {
              char: '童',
              pinyin: 'tóng',
              meaning: '小孩子',
              meaningEn: 'child; children',
              example: '儿童',
              examplePinyin: 'ér tóng',
              exampleMeaning: 'children',
              examples: ["儿童","童年","童话"]
            },
            {
              char: '妆',
              pinyin: 'zhuāng',
              meaning: '打扮；装饰',
              meaningEn: 'to adorn; to dress up',
              example: '妆扮',
              examplePinyin: 'zhuāng bàn',
              exampleMeaning: 'to dress up / adorn',
              examples: ["化妆","妆扮","淡妆"]
            },
            {
              char: '丝',
              pinyin: 'sī',
              meaning: '细长的线状物；蚕丝',
              meaningEn: 'silk; thread; fine strand',
              example: '丝绸',
              examplePinyin: 'sī chóu',
              exampleMeaning: 'silk fabric',
              examples: ["丝绸","丝带","蚕丝"]
            },
            {
              char: '村',
              pinyin: 'cūn',
              meaning: '农村；村庄',
              meaningEn: 'village; rural',
              example: '村庄',
              examplePinyin: 'cūn zhuāng',
              exampleMeaning: 'village',
              examples: ["村庄","农村","村子"]
            },
            {
              char: '碧',
              pinyin: 'bì',
              meaning: '青绿色；像玉一样的颜色',
              meaningEn: 'jade green; emerald',
              example: '碧绿',
              examplePinyin: 'bì lǜ',
              exampleMeaning: 'jade green',
              examples: ["碧绿","碧蓝","碧玉"]
            },
            {
              char: '绿',
              pinyin: 'lǜ',
              meaning: '草和树叶的颜色',
              meaningEn: 'green',
              example: '绿色',
              examplePinyin: 'lǜ sè',
              exampleMeaning: 'green (color)',
              examples: ["绿色","绿叶","碧绿"]
            },
            {
              char: '剪',
              pinyin: 'jiǎn',
              meaning: '用剪刀切断',
              meaningEn: 'to cut with scissors',
              example: '剪刀',
              examplePinyin: 'jiǎn dāo',
              exampleMeaning: 'scissors',
              examples: ["剪刀","剪纸","剪切"]
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
              exampleMeaning: 'to rush out',
              examples: ["冲出","冲破","冲动"]
            },
            {
              char: '姑',
              pinyin: 'gū',
              meaning: '父亲的姐妹；姑娘',
              meaningEn: "father's sister; girl",
              example: '姑娘',
              examplePinyin: 'gū niáng',
              exampleMeaning: 'girl; young woman',
              examples: ["姑娘","小姑","姑父"]
            },
            {
              char: '吐',
              pinyin: 'tǔ',
              meaning: '从口中或内部冒出',
              meaningEn: 'to sprout; to spit out',
              example: '吐芽',
              examplePinyin: 'tǔ yá',
              exampleMeaning: 'to sprout buds',
              examples: ["吐芽","吐出","吐露"]
            },
            {
              char: '荡',
              pinyin: 'dàng',
              meaning: '摇摆；飘动',
              meaningEn: 'to swing; to sway',
              example: '荡秋千',
              examplePinyin: 'dàng qiū qiān',
              exampleMeaning: 'to swing on a swing',
              examples: ["荡秋千","荡漾","飘荡"]
            },
            {
              char: '杏',
              pinyin: 'xìng',
              meaning: '一种春天开花的果树',
              meaningEn: 'apricot (tree/fruit)',
              example: '杏花',
              examplePinyin: 'xìng huā',
              exampleMeaning: 'apricot blossom',
              examples: ["杏花","杏仁","杏树"]
            },
            {
              char: '寻',
              pinyin: 'xún',
              meaning: '找；搜索',
              meaningEn: 'to seek; to look for',
              example: '寻找',
              examplePinyin: 'xún zhǎo',
              exampleMeaning: 'to search / look for',
              examples: ["寻找","追寻","寻问"]
            },
            {
              char: '娘',
              pinyin: 'niáng',
              meaning: '女性；母亲的口语称呼',
              meaningEn: 'mother; woman; girl',
              example: '姑娘',
              examplePinyin: 'gū niáng',
              exampleMeaning: 'girl; young woman',
              examples: ["姑娘","新娘","娘家"]
            },
            {
              char: '柳',
              pinyin: 'liǔ',
              meaning: '一种枝条细长的树',
              meaningEn: 'willow (tree)',
              example: '柳树',
              examplePinyin: 'liǔ shù',
              exampleMeaning: 'willow tree',
              examples: ["柳树","柳枝","柳叶"]
            },
            {
              char: '桃',
              pinyin: 'táo',
              meaning: '一种春天开花的果树',
              meaningEn: 'peach (tree/fruit)',
              example: '桃花',
              examplePinyin: 'táo huā',
              exampleMeaning: 'peach blossom',
              examples: ["桃花","桃子","桃树"]
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
              exampleMeaning: 'fresh flowers',
              examples: ["鲜花","新鲜","鲜艳"]
            },
            {
              char: '递',
              pinyin: 'dì',
              meaning: '传送；交给',
              meaningEn: 'to pass; to hand over; to deliver',
              example: '递给',
              examplePinyin: 'dì gěi',
              exampleMeaning: 'to hand/pass to',
              examples: ["递给","传递","递送"]
            },
            {
              char: '原',
              pinyin: 'yuán',
              meaning: '原来；本来',
              meaningEn: 'original; former; source',
              example: '原来',
              examplePinyin: 'yuán lái',
              exampleMeaning: 'originally; as it turns out',
              examples: ["原来","原因","草原"]
            },
            {
              char: '局',
              pinyin: 'jú',
              meaning: '机构；部门',
              meaningEn: 'bureau; office; department',
              example: '邮局',
              examplePinyin: 'yóu jú',
              exampleMeaning: 'post office',
              examples: ["邮局","局面","结局"]
            },
            {
              char: '礼',
              pinyin: 'lǐ',
              meaning: '礼物；礼节',
              meaningEn: 'gift; courtesy; etiquette',
              example: '礼物',
              examplePinyin: 'lǐ wù',
              exampleMeaning: 'gift; present',
              examples: ["礼物","礼貌","行礼"]
            },
            {
              char: '邮',
              pinyin: 'yóu',
              meaning: '邮寄；与邮政有关',
              meaningEn: 'mail; postal',
              example: '邮局',
              examplePinyin: 'yóu jú',
              exampleMeaning: 'post office',
              examples: ["邮局","邮票","邮件"]
            },
            {
              char: '员',
              pinyin: 'yuán',
              meaning: '从事某种工作的人',
              meaningEn: 'member; staff; employee',
              example: '邮递员',
              examplePinyin: 'yóu dì yuán',
              exampleMeaning: 'mail carrier; postman',
              examples: ["队员","成员","邮递员"]
            },
            {
              char: '叔',
              pinyin: 'shū',
              meaning: '父亲的弟弟；男性长辈的称呼',
              meaningEn: "uncle (father's younger brother)",
              example: '叔叔',
              examplePinyin: 'shū shu',
              exampleMeaning: 'uncle',
              examples: ["叔叔","大叔","叔父"]
            },
            {
              char: '堆',
              pinyin: 'duī',
              meaning: '堆积；一堆东西',
              meaningEn: 'pile; heap; to pile up',
              example: '一堆',
              examplePinyin: 'yī duī',
              exampleMeaning: 'a pile of',
              examples: ["一堆","堆积","土堆"]
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
              exampleMeaning: 'Deng Xiaoping',
              examples: ["邓小平"]
            },
            {
              char: '格',
              pinyin: 'gé',
              meaning: '方格；规格；品格',
              meaningEn: 'grid; standard; character',
              example: '格外',
              examplePinyin: 'gé wài',
              exampleMeaning: 'especially; particularly',
              examples: ["格外","规格","品格"]
            },
            {
              char: '注',
              pinyin: 'zhù',
              meaning: '注意；灌注',
              meaningEn: 'to pay attention; to pour into',
              example: '注意',
              examplePinyin: 'zhù yì',
              exampleMeaning: 'to pay attention; be careful',
              examples: ["注意","注册","注射"]
            },
            {
              char: '休',
              pinyin: 'xiū',
              meaning: '休息；停止',
              meaningEn: 'to rest; to stop',
              example: '休息',
              examplePinyin: 'xiū xi',
              exampleMeaning: 'to rest; to take a break',
              examples: ["休息","休假","休学"]
            },
            {
              char: '植',
              pinyin: 'zhí',
              meaning: '种植；植物',
              meaningEn: 'to plant; vegetation',
              example: '植树',
              examplePinyin: 'zhí shù',
              exampleMeaning: 'to plant trees',
              examples: ["植树","植物","种植"]
            },
            {
              char: '引',
              pinyin: 'yǐn',
              meaning: '引导；带领',
              meaningEn: 'to lead; to guide; to attract',
              example: '引导',
              examplePinyin: 'yǐn dǎo',
              exampleMeaning: 'to guide; to lead',
              examples: ["引导","引进","吸引"]
            },
            {
              char: '满',
              pinyin: 'mǎn',
              meaning: '充满；全；达到限度',
              meaningEn: 'full; filled; satisfied',
              example: '满意',
              examplePinyin: 'mǎn yì',
              exampleMeaning: 'satisfied; pleased',
              examples: ["满意","充满","满足"]
            },
            {
              char: '息',
              pinyin: 'xī',
              meaning: '休息；呼吸；消息',
              meaningEn: 'rest; breath; news',
              example: '休息',
              examplePinyin: 'xiū xi',
              exampleMeaning: 'to rest; to take a break',
              examples: ["休息","消息","气息"]
            },
          ]
        },
        // unit 2
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
              exampleMeaning: 'Lei Feng (model soldier)',
              examples: ["刀锋","先锋","雷锋"]
            },
            {
              char: '冒',
              pinyin: 'mào',
              meaning: '顶着；冒出；冒险',
              meaningEn: 'to brave; to emit; to risk',
              example: '冒着',
              examplePinyin: 'mào zhe',
              exampleMeaning: 'braving; in the face of',
              examples: ["冒险","冒出","冒着"]
            },
            {
              char: '弯',
              pinyin: 'wān',
              meaning: '不直；弯曲',
              meaningEn: 'bend; curve; curved',
              example: '弯路',
              examplePinyin: 'wān lù',
              exampleMeaning: 'winding road',
              examples: ["弯路","弯曲","弯腰"]
            },
            {
              char: '洒',
              pinyin: 'sǎ',
              meaning: '液体散落；撒',
              meaningEn: 'to sprinkle; to spill',
              example: '洒下',
              examplePinyin: 'sǎ xià',
              exampleMeaning: 'to sprinkle down',
              examples: ["洒水","洒落","洒下"]
            },
            {
              char: '暖',
              pinyin: 'nuǎn',
              meaning: '温暖；不冷',
              meaningEn: 'warm; warmth',
              example: '温暖',
              examplePinyin: 'wēn nuǎn',
              exampleMeaning: 'warm; warmth',
              examples: ["温暖","暖和","暖气"]
            },
            {
              char: '昨',
              pinyin: 'zuó',
              meaning: '昨天；过去的',
              meaningEn: 'yesterday',
              example: '昨天',
              examplePinyin: 'zuó tiān',
              exampleMeaning: 'yesterday',
              examples: ["昨天","昨晚","昨日"]
            },
            {
              char: '留',
              pinyin: 'liú',
              meaning: '留下；保留；停留',
              meaningEn: 'to stay; to leave behind; to keep',
              example: '留下',
              examplePinyin: 'liú xià',
              exampleMeaning: 'to leave behind; to stay',
              examples: ["留下","保留","留学"]
            },
            {
              char: '背',
              pinyin: 'bēi',
              meaning: '背着；用背驮',
              meaningEn: 'to carry on the back',
              example: '背着',
              examplePinyin: 'bēi zhe',
              exampleMeaning: 'carrying on one\'s back',
              examples: ["背包","背着","背负"]
            },
            {
              char: '温',
              pinyin: 'wēn',
              meaning: '温暖；温度；温和',
              meaningEn: 'warm; temperature; gentle',
              example: '温暖',
              examplePinyin: 'wēn nuǎn',
              exampleMeaning: 'warm; warmth',
              examples: ["温暖","温度","温和"]
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
              exampleMeaning: 'ability; capability',
              examples: ["能力","能干","能够"]
            },
            {
              char: '味',
              pinyin: 'wèi',
              meaning: '味道；气味',
              meaningEn: 'taste; flavor; smell',
              example: '味道',
              examplePinyin: 'wèi dào',
              exampleMeaning: 'taste; flavor',
              examples: ["味道","气味","美味"]
            },
            {
              char: '具',
              pinyin: 'jù',
              meaning: '工具；器具',
              meaningEn: 'tool; implement; utensil',
              example: '农具',
              examplePinyin: 'nóng jù',
              exampleMeaning: 'farming tools',
              examples: ["工具","农具","玩具"]
            },
            {
              char: '甜',
              pinyin: 'tián',
              meaning: '像糖一样的味道',
              meaningEn: 'sweet',
              example: '甜蜜',
              examplePinyin: 'tián mì',
              exampleMeaning: 'sweet; honey-sweet',
              examples: ["甜蜜","甜味","甜食"]
            },
            {
              char: '劳',
              pinyin: 'láo',
              meaning: '劳动；辛苦',
              meaningEn: 'labor; toil; to work hard',
              example: '劳动',
              examplePinyin: 'láo dòng',
              exampleMeaning: 'labor; to work',
              examples: ["劳动","辛劳","劳累"]
            },
            {
              char: '桌',
              pinyin: 'zhuō',
              meaning: '桌子；台子',
              meaningEn: 'table; desk',
              example: '桌子',
              examplePinyin: 'zhuō zi',
              exampleMeaning: 'table; desk',
              examples: ["桌子","书桌","桌椅"]
            },
            {
              char: '买',
              pinyin: 'mǎi',
              meaning: '付钱得到东西',
              meaningEn: 'to buy; to purchase',
              example: '买东西',
              examplePinyin: 'mǎi dōng xi',
              exampleMeaning: 'to buy things; to shop',
              examples: ["购买","买卖","买东西"]
            },
            {
              char: '甘',
              pinyin: 'gān',
              meaning: '甜；甘蔗',
              meaningEn: 'sweet; willing; sugarcane',
              example: '甘蔗',
              examplePinyin: 'gān zhè',
              exampleMeaning: 'sugar cane',
              examples: ["甘蔗","甘甜","甘心"]
            },
            {
              char: '菜',
              pinyin: 'cài',
              meaning: '蔬菜；菜肴',
              meaningEn: 'vegetable; dish; food',
              example: '蔬菜',
              examplePinyin: 'shū cài',
              exampleMeaning: 'vegetables',
              examples: ["蔬菜","炒菜","菜肴"]
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
              exampleMeaning: 'a horse',
              examples: ["一匹马","布匹","匹配"]
            },
            {
              char: '波',
              pinyin: 'bō',
              meaning: '水波；波浪',
              meaningEn: 'wave; ripple',
              example: '波浪',
              examplePinyin: 'bō làng',
              exampleMeaning: 'waves',
              examples: ["波浪","波纹","声波"]
            },
            {
              char: '像',
              pinyin: 'xiàng',
              meaning: '好像；相似；图像',
              meaningEn: 'to resemble; like; image',
              example: '好像',
              examplePinyin: 'hǎo xiàng',
              exampleMeaning: 'seems like; as if',
              examples: ["好像","图像","画像"]
            },
            {
              char: '恋',
              pinyin: 'liàn',
              meaning: '留恋；依恋；爱恋',
              meaningEn: 'to be attached to; to love; to long for',
              example: '留恋',
              examplePinyin: 'liú liàn',
              exampleMeaning: 'reluctant to leave; to feel attached',
              examples: ["留恋","恋爱","依恋"]
            },
            {
              char: '求',
              pinyin: 'qiú',
              meaning: '请求；要求；寻求',
              meaningEn: 'to beg; to request; to seek',
              example: '请求',
              examplePinyin: 'qǐng qiú',
              exampleMeaning: 'to request; to ask',
              examples: ["请求","要求","追求"]
            },
            {
              char: '妹',
              pinyin: 'mèi',
              meaning: '年幼的女性兄弟姐妹',
              meaningEn: 'younger sister',
              example: '妹妹',
              examplePinyin: 'mèi mei',
              exampleMeaning: 'younger sister',
              examples: ["妹妹","姐妹","小妹"]
            },
            {
              char: '纹',
              pinyin: 'wén',
              meaning: '花纹；纹路',
              meaningEn: 'pattern; veins; lines',
              example: '波纹',
              examplePinyin: 'bō wén',
              exampleMeaning: 'ripples; wave pattern',
              examples: ["花纹","波纹","纹路"]
            },
            {
              char: '景',
              pinyin: 'jǐng',
              meaning: '景色；风景',
              meaningEn: 'scenery; view; scene',
              example: '风景',
              examplePinyin: 'fēng jǐng',
              exampleMeaning: 'scenery; landscape',
              examples: ["风景","景色","美景"]
            },
            {
              char: '舍',
              pinyin: 'shě',
              meaning: '舍不得；放弃',
              meaningEn: 'to be reluctant to give up; to abandon',
              example: '舍不得',
              examplePinyin: 'shě bu dé',
              exampleMeaning: 'reluctant to part with',
              examples: ["舍不得","宿舍","舍去"]
            },
          ]
        },

        // ── Unit 3 ────────────────────────────────────────────────
        {
          number: 1,
          unit: 3,
          title: '神州谣',
          words: [
            {
              char: '州',
              pinyin: 'zhōu',
              meaning: '地区；行政区划',
              meaningEn: 'prefecture; region; state',
              example: '神州',
              examplePinyin: 'shén zhōu',
              exampleMeaning: 'China (poetic name)',
              examples: ["神州","广州","苏州"]
            },
            {
              char: '岛',
              pinyin: 'dǎo',
              meaning: '四面环水的陆地',
              meaningEn: 'island',
              example: '岛屿',
              examplePinyin: 'dǎo yǔ',
              exampleMeaning: 'islands',
              examples: ["岛屿","半岛","海岛"]
            },
            {
              char: '民',
              pinyin: 'mín',
              meaning: '人民；百姓',
              meaningEn: 'people; citizens',
              example: '人民',
              examplePinyin: 'rén mín',
              exampleMeaning: 'the people',
              examples: ["人民","民族","市民"]
            },
            {
              char: '谊',
              pinyin: 'yì',
              meaning: '友好的情意',
              meaningEn: 'friendship; goodwill',
              example: '友谊',
              examplePinyin: 'yǒu yì',
              exampleMeaning: 'friendship',
              examples: ["友谊","情谊","联谊"]
            },
            {
              char: '奋',
              pinyin: 'fèn',
              meaning: '振奋；努力向上',
              meaningEn: 'to strive; to exert oneself',
              example: '奋发',
              examplePinyin: 'fèn fā',
              exampleMeaning: 'to work hard; to strive',
              examples: ["奋发","勤奋","振奋"]
            },
            {
              char: '华',
              pinyin: 'huá',
              meaning: '华夏；中华；繁华',
              meaningEn: 'China; magnificent; splendid',
              example: '中华',
              examplePinyin: 'zhōng huá',
              exampleMeaning: 'China; Chinese nation',
              examples: ["中华","华夏","繁华"]
            },
            {
              char: '峡',
              pinyin: 'xiá',
              meaning: '两山之间的狭窄通道',
              meaningEn: 'gorge; strait; canyon',
              example: '三峡',
              examplePinyin: 'Sān Xiá',
              exampleMeaning: 'Three Gorges',
              examples: ["三峡","峡谷","海峡"]
            },
            {
              char: '族',
              pinyin: 'zú',
              meaning: '民族；家族',
              meaningEn: 'ethnic group; clan; nationality',
              example: '民族',
              examplePinyin: 'mín zú',
              exampleMeaning: 'ethnic group; nationality',
              examples: ["民族","家族","汉族"]
            },
            {
              char: '齐',
              pinyin: 'qí',
              meaning: '整齐；一起；共同',
              meaningEn: 'together; in unison; neat',
              example: '齐心',
              examplePinyin: 'qí xīn',
              exampleMeaning: 'of one mind; united',
              examples: ["齐心","整齐","一齐"]
            },
          ]
        },
        {
          number: 2,
          unit: 3,
          title: '传统节日',
          words: [
            {
              char: '贴',
              pinyin: 'tiē',
              meaning: '粘上；紧靠',
              meaningEn: 'to paste; to stick; to post',
              example: '贴春联',
              examplePinyin: 'tiē chūn lián',
              exampleMeaning: 'to post Spring Festival couplets',
              examples: ["贴近","粘贴","贴心"]
            },
            {
              char: '舟',
              pinyin: 'zhōu',
              meaning: '船；小船',
              meaningEn: 'boat; vessel',
              example: '龙舟',
              examplePinyin: 'lóng zhōu',
              exampleMeaning: 'dragon boat',
              examples: ["龙舟","小舟","行舟"]
            },
            {
              char: '敬',
              pinyin: 'jìng',
              meaning: '尊敬；恭敬',
              meaningEn: 'to respect; to honor',
              example: '敬老',
              examplePinyin: 'jìng lǎo',
              exampleMeaning: 'to respect the elderly',
              examples: ["尊敬","敬礼","敬老"]
            },
            {
              char: '团',
              pinyin: 'tuán',
              meaning: '团圆；聚在一起；圆形',
              meaningEn: 'reunion; group; round',
              example: '团圆',
              examplePinyin: 'tuán yuán',
              exampleMeaning: 'family reunion',
              examples: ["团圆","团结","团队"]
            },
            {
              char: '闹',
              pinyin: 'nào',
              meaning: '热闹；吵闹；闹腾',
              meaningEn: 'noisy; lively; to make noise',
              example: '热闹',
              examplePinyin: 'rè nào',
              exampleMeaning: 'lively; bustling',
              examples: ["热闹","闹钟","吵闹"]
            },
            {
              char: '街',
              pinyin: 'jiē',
              meaning: '街道；马路',
              meaningEn: 'street; road',
              example: '大街',
              examplePinyin: 'dà jiē',
              exampleMeaning: 'main street; avenue',
              examples: ["大街","街道","街市"]
            },
            {
              char: '艾',
              pinyin: 'ài',
              meaning: '艾草；一种草本植物',
              meaningEn: 'moxa; mugwort (herb)',
              example: '艾草',
              examplePinyin: 'ài cǎo',
              exampleMeaning: 'mugwort; moxa herb',
              examples: ["艾草","艾叶","艾蒿"]
            },
            {
              char: '转',
              pinyin: 'zhuǎn',
              meaning: '转动；改变方向',
              meaningEn: 'to turn; to rotate; to change direction',
              example: '转眼',
              examplePinyin: 'zhuǎn yǎn',
              exampleMeaning: 'in the blink of an eye',
              examples: ["转动","转变","转眼"]
            },
            {
              char: '热',
              pinyin: 'rè',
              meaning: '温度高；热闹；热情',
              meaningEn: 'hot; heat; enthusiastic',
              example: '热闹',
              examplePinyin: 'rè nào',
              exampleMeaning: 'lively; bustling',
              examples: ["热情","热爱","炎热"]
            },
          ]
        },
        {
          number: 3,
          unit: 3,
          title: '"贝"的故事',
          words: [
            {
              char: '贝',
              pinyin: 'bèi',
              meaning: '贝壳；古代用作货币',
              meaningEn: 'shell; cowrie (ancient currency)',
              example: '贝壳',
              examplePinyin: 'bèi ké',
              exampleMeaning: 'seashell',
              examples: ["贝壳","宝贝","贝类"]
            },
            {
              char: '甲',
              pinyin: 'jiǎ',
              meaning: '第一；甲骨；盔甲',
              meaningEn: 'first; shell; armor; oracle bone',
              example: '甲骨文',
              examplePinyin: 'jiǎ gǔ wén',
              exampleMeaning: 'oracle bone script',
              examples: ["指甲","盔甲","甲骨文"]
            },
            {
              char: '钱',
              pinyin: 'qián',
              meaning: '金钱；货币',
              meaningEn: 'money; cash; currency',
              example: '钱币',
              examplePinyin: 'qián bì',
              exampleMeaning: 'coins; currency',
              examples: ["钱包","零钱","钱币"]
            },
            {
              char: '与',
              pinyin: 'yǔ',
              meaning: '和；跟；给',
              meaningEn: 'and; with; to give',
              example: '与其',
              examplePinyin: 'yǔ qí',
              exampleMeaning: 'rather than',
              examples: ["参与","与其","给与"]
            },
            {
              char: '关',
              pinyin: 'guān',
              meaning: '关系；关闭；有关',
              meaningEn: 'relation; to close; related to',
              example: '有关',
              examplePinyin: 'yǒu guān',
              exampleMeaning: 'related to; about',
              examples: ["关心","关闭","有关"]
            },
            {
              char: '壳',
              pinyin: 'ké',
              meaning: '外壳；硬的外皮',
              meaningEn: 'shell; hard outer covering',
              example: '贝壳',
              examplePinyin: 'bèi ké',
              exampleMeaning: 'seashell',
              examples: ["贝壳","蛋壳","外壳"]
            },
            {
              char: '骨',
              pinyin: 'gǔ',
              meaning: '骨头；骨骼',
              meaningEn: 'bone; skeleton',
              example: '甲骨',
              examplePinyin: 'jiǎ gǔ',
              exampleMeaning: 'oracle bones (turtle shell & animal bone)',
              examples: ["骨头","筋骨","甲骨"]
            },
            {
              char: '币',
              pinyin: 'bì',
              meaning: '货币；钱',
              meaningEn: 'currency; coin; money',
              example: '人民币',
              examplePinyin: 'rén mín bì',
              exampleMeaning: 'RMB (Chinese currency)',
              examples: ["人民币","硬币","钱币"]
            },
            {
              char: '财',
              pinyin: 'cái',
              meaning: '财富；钱财',
              meaningEn: 'wealth; riches; money',
              example: '财富',
              examplePinyin: 'cái fù',
              exampleMeaning: 'wealth; riches',
              examples: ["财富","钱财","发财"]
            },
          ]
        },
        {
          number: 4,
          unit: 3,
          title: '中国美食',
          words: [
            {
              char: '',
              pinyin: '',
              meaning: '',
              meaningEn: '',
              example: '',
              examplePinyin: '',
              exampleMeaning: '',
              examples: []
            },
          ]
        },
        // ── Unit 4 ────────────────────────────────────────────────
        {
          number: 8,
          unit: 4,
          title: '彩色的梦',
          words: [
            {
              char: '彩',
              pinyin: 'cǎi',
              meaning: '颜色；彩色；精彩',
              meaningEn: 'color; colorful; brilliant',
              example: '彩色',
              examplePinyin: 'cǎi sè',
              exampleMeaning: 'colorful; multicolored',
              examples: ["彩色","彩虹","精彩"]
            },
            {
              char: '森',
              pinyin: 'sēn',
              meaning: '树木众多；森林',
              meaningEn: 'forest; densely wooded',
              example: '森林',
              examplePinyin: 'sēn lín',
              exampleMeaning: 'forest',
              examples: ["森林","阴森","森严"]
            },
            {
              char: '结',
              pinyin: 'jié',
              meaning: '结果；结束；打结',
              meaningEn: 'to bear fruit; to knot; result',
              example: '结果',
              examplePinyin: 'jié guǒ',
              exampleMeaning: 'result; to bear fruit',
              examples: ["结果","结束","结合"]
            },
            {
              char: '般',
              pinyin: 'bān',
              meaning: '一样；如同；种类',
              meaningEn: 'like; as if; sort; kind',
              example: '一般',
              examplePinyin: 'yī bān',
              exampleMeaning: 'ordinary; in general; like',
              examples: ["一般","百般","万般"]
            },
            {
              char: '灵',
              pinyin: 'líng',
              meaning: '灵活；心灵；神灵',
              meaningEn: 'quick; clever; spirit; soul',
              example: '灵气',
              examplePinyin: 'líng qì',
              exampleMeaning: 'spirit; liveliness; cleverness',
              examples: ["灵气","心灵","精灵"]
            },
            {
              char: '梦',
              pinyin: 'mèng',
              meaning: '梦想；做梦',
              meaningEn: 'dream',
              example: '梦想',
              examplePinyin: 'mèng xiǎng',
              exampleMeaning: 'dream; aspiration',
              examples: ["梦想","做梦","梦境"]
            },
            {
              char: '拉',
              pinyin: 'lā',
              meaning: '拉动；拖；拉开',
              meaningEn: 'to pull; to drag; to draw',
              example: '拉开',
              examplePinyin: 'lā kāi',
              exampleMeaning: 'to pull open; to stretch apart',
              examples: ["拉开","拉着","拖拉"]
            },
            {
              char: '苹',
              pinyin: 'píng',
              meaning: '苹果（植物名）',
              meaningEn: 'apple (used in 苹果)',
              example: '苹果',
              examplePinyin: 'píng guǒ',
              exampleMeaning: 'apple',
              examples: ["苹果"]
            },
            {
              char: '精',
              pinyin: 'jīng',
              meaning: '精彩；精灵；精细',
              meaningEn: 'excellent; spirit; refined; essence',
              example: '精灵',
              examplePinyin: 'jīng líng',
              exampleMeaning: 'elf; sprite; clever creature',
              examples: ["精彩","精神","精心"]
            },
          ]
        },
        {
          number: 9,
          unit: 4,
          title: '枫树上的喜鹊',
          words: [
            {
              char: '伞',
              pinyin: 'sǎn',
              meaning: '雨伞；遮雨或遮阳的工具',
              meaningEn: 'umbrella; parasol',
              example: '雨伞',
              examplePinyin: 'yǔ sǎn',
              exampleMeaning: 'umbrella',
              examples: ["雨伞","降落伞","伞兵"]
            },
            {
              char: '弟',
              pinyin: 'dì',
              meaning: '弟弟；年幼的兄弟',
              meaningEn: 'younger brother',
              example: '弟弟',
              examplePinyin: 'dì di',
              exampleMeaning: 'younger brother',
              examples: ["弟弟","兄弟","弟子"]
            },
            {
              char: '教',
              pinyin: 'jiāo',
              meaning: '教导；传授知识',
              meaningEn: 'to teach; to instruct',
              example: '教导',
              examplePinyin: 'jiāo dǎo',
              exampleMeaning: 'to teach; to guide',
              examples: ["教室","教学","教导"]
            },
            {
              char: '戏',
              pinyin: 'xì',
              meaning: '游戏；玩耍；戏剧',
              meaningEn: 'play; game; drama',
              example: '游戏',
              examplePinyin: 'yóu xì',
              exampleMeaning: 'game; to play',
              examples: ["游戏","戏剧","看戏"]
            },
            {
              char: '姨',
              pinyin: 'yí',
              meaning: '母亲的姐妹；阿姨',
              meaningEn: "mother's sister; auntie",
              example: '阿姨',
              examplePinyin: 'ā yí',
              exampleMeaning: 'auntie; adult woman',
              examples: ["阿姨","姨妈","小姨"]
            },
            {
              char: '便',
              pinyin: 'biàn',
              meaning: '方便；就；顺便',
              meaningEn: 'convenient; then; so',
              example: '方便',
              examplePinyin: 'fāng biàn',
              exampleMeaning: 'convenient; handy',
              examples: ["方便","便利","顺便"]
            },
            {
              char: '游',
              pinyin: 'yóu',
              meaning: '游泳；游览；游玩',
              meaningEn: 'to swim; to travel; to play',
              example: '游玩',
              examplePinyin: 'yóu wán',
              exampleMeaning: 'to play; to have fun',
              examples: ["游泳","旅游","游玩"]
            },
            {
              char: '母',
              pinyin: 'mǔ',
              meaning: '妈妈；母亲',
              meaningEn: 'mother',
              example: '母亲',
              examplePinyin: 'mǔ qīn',
              exampleMeaning: 'mother',
              examples: ["母亲","父母","祖母"]
            },
          ]
        },
        {
          number: 10,
          unit: 4,
          title: '沙滩上的童话',
          words: [
            {
              char: '周',
              pinyin: 'zhōu',
              meaning: '周围；一周；姓周',
              meaningEn: 'around; week; circumference',
              example: '周围',
              examplePinyin: 'zhōu wéi',
              exampleMeaning: 'surroundings; around',
              examples: ["周围","周末","一周"]
            },
            {
              char: '句',
              pinyin: 'jù',
              meaning: '句子；语言单位',
              meaningEn: 'sentence; phrase',
              example: '句子',
              examplePinyin: 'jù zi',
              exampleMeaning: 'sentence',
              examples: ["句子","诗句","造句"]
            },
            {
              char: '充',
              pinyin: 'chōng',
              meaning: '充满；充实；填充',
              meaningEn: 'to fill; full; sufficient',
              example: '充满',
              examplePinyin: 'chōng mǎn',
              exampleMeaning: 'filled with; full of',
              examples: ["充满","充实","充电"]
            },
            {
              char: '合',
              pinyin: 'hé',
              meaning: '合在一起；合适；符合',
              meaningEn: 'to combine; suitable; to fit',
              example: '合力',
              examplePinyin: 'hé lì',
              exampleMeaning: 'to join forces; combined strength',
              examples: ["合作","合适","合力"]
            },
            {
              char: '记',
              pinyin: 'jì',
              meaning: '记住；记录',
              meaningEn: 'to remember; to record',
              example: '记住',
              examplePinyin: 'jì zhù',
              exampleMeaning: 'to remember; to keep in mind',
              examples: ["记住","日记","记录"]
            },
            {
              char: '围',
              pinyin: 'wéi',
              meaning: '包围；周围；围绕',
              meaningEn: 'to surround; around; encircle',
              example: '包围',
              examplePinyin: 'bāo wéi',
              exampleMeaning: 'to surround; to encircle',
              examples: ["周围","包围","围巾"]
            },
            {
              char: '补',
              pinyin: 'bǔ',
              meaning: '修补；补充；弥补',
              meaningEn: 'to patch; to supplement; to make up for',
              example: '补充',
              examplePinyin: 'bǔ chōng',
              exampleMeaning: 'to supplement; to add',
              examples: ["补充","修补","补习"]
            },
            {
              char: '药',
              pinyin: 'yào',
              meaning: '药物；医药',
              meaningEn: 'medicine; drug',
              example: '药物',
              examplePinyin: 'yào wù',
              exampleMeaning: 'medicine; drugs',
              examples: ["药物","草药","吃药"]
            },
            {
              char: '死',
              pinyin: 'sǐ',
              meaning: '死亡；不能动',
              meaningEn: 'to die; dead',
              example: '死去',
              examplePinyin: 'sǐ qù',
              exampleMeaning: 'to die; to pass away',
              examples: ["死亡","生死"]
            },
          ]
        },
        {
          number: 11,
          unit: 4,
          title: '我是一只小虫子',
          words: [
            {
              char: '屁',
              pinyin: 'pì',
              meaning: '屁股；放屁',
              meaningEn: 'fart; bottom (informal)',
              example: '放屁',
              examplePinyin: 'fàng pì',
              exampleMeaning: 'to fart',
              examples: ["屁股","放屁"]
            },
            {
              char: '股',
              pinyin: 'gǔ',
              meaning: '屁股；大腿部分',
              meaningEn: 'buttocks; thigh; portion',
              example: '屁股',
              examplePinyin: 'pì gu',
              exampleMeaning: 'bottom; buttocks',
              examples: ["屁股","股份","一股"]
            },
            {
              char: '尿',
              pinyin: 'niào',
              meaning: '小便；排泄液体',
              meaningEn: 'urine; to urinate',
              example: '尿尿',
              examplePinyin: 'niào niào',
              exampleMeaning: 'to pee (child speech)',
              examples: ["尿床","尿尿"]
            },
            {
              char: '净',
              pinyin: 'jìng',
              meaning: '干净；清洁',
              meaningEn: 'clean; pure; only',
              example: '干净',
              examplePinyin: 'gān jìng',
              exampleMeaning: 'clean; tidy',
              examples: ["干净","净化","清净"]
            },
            {
              char: '屎',
              pinyin: 'shǐ',
              meaning: '粪便；排泄物',
              meaningEn: 'excrement; feces',
              example: '粪屎',
              examplePinyin: 'fèn shǐ',
              exampleMeaning: 'dung; droppings',
              examples: ["眼屎","鼻屎"]
            },
            {
              char: '幸',
              pinyin: 'xìng',
              meaning: '幸运；幸福',
              meaningEn: 'lucky; fortunate; happiness',
              example: '幸运',
              examplePinyin: 'xìng yùn',
              exampleMeaning: 'lucky; fortunate',
              examples: ["幸运","幸福","不幸"]
            },
            {
              char: '使',
              pinyin: 'shǐ',
              meaning: '使用；让；派遣',
              meaningEn: 'to use; to make; to send',
              example: '使劲',
              examplePinyin: 'shǐ jìn',
              exampleMeaning: 'to exert force; to try hard',
              examples: ["使用","使劲","使命"]
            },
            {
              char: '劲',
              pinyin: 'jìn',
              meaning: '力气；劲头；使劲',
              meaningEn: 'strength; energy; effort',
              example: '使劲',
              examplePinyin: 'shǐ jìn',
              exampleMeaning: 'to exert force; to try hard',
              examples: ["劲头","干劲","用劲"]
            },
          ]
        },
        // unit 5
        {
          number: 12,
          unit: 5,
          title: '寓言二则',
          words: [
            {
              char: '亡',
              pinyin: 'wáng',
              meaning: '丢失；死亡；逃跑',
              meaningEn: 'to lose; to die; to flee',
              example: '亡羊补牢',
              examplePinyin: 'wáng yáng bǔ láo',
              exampleMeaning: 'mend the pen after the sheep is lost',
              examples: ["死亡","逃亡","亡羊补牢"]
            },
            {
              char: '牢',
              pinyin: 'láo',
              meaning: '牢固；牢笼；羊圈',
              meaningEn: 'firm; pen; enclosure; jail',
              example: '羊牢',
              examplePinyin: 'yáng láo',
              exampleMeaning: 'sheep pen',
              examples: ["牢固","坐牢","牢记"]
            },
            {
              char: '钻',
              pinyin: 'zuān',
              meaning: '钻进；穿过；钻孔',
              meaningEn: 'to drill; to bore through; to get into',
              example: '钻进',
              examplePinyin: 'zuān jìn',
              exampleMeaning: 'to drill/squeeze into',
              examples: ["钻研","钻进","钻石"]
            },
            {
              char: '劝',
              pinyin: 'quàn',
              meaning: '劝说；劝告',
              meaningEn: 'to advise; to persuade',
              example: '劝告',
              examplePinyin: 'quàn gào',
              exampleMeaning: 'to advise; advice',
              examples: ["劝告","劝说","劝导"]
            },
            {
              char: '丢',
              pinyin: 'diū',
              meaning: '丢失；失去',
              meaningEn: 'to lose; to throw away',
              example: '丢失',
              examplePinyin: 'diū shī',
              exampleMeaning: 'to lose; to misplace',
              examples: ["丢失","丢掉","丢脸"]
            },
            {
              char: '告',
              pinyin: 'gào',
              meaning: '告诉；报告；劝告',
              meaningEn: 'to tell; to inform; to report',
              example: '告诉',
              examplePinyin: 'gào sù',
              exampleMeaning: 'to tell; to inform',
              examples: ["告诉","报告","警告"]
            },
            {
              char: '筋',
              pinyin: 'jīn',
              meaning: '筋疲力尽；肌肉；筋骨',
              meaningEn: 'muscle; tendon; sinew',
              example: '筋疲力尽',
              examplePinyin: 'jīn pí lì jìn',
              exampleMeaning: 'exhausted; worn out',
              examples: ["筋骨","筋疲力尽"]
            },
            {
              char: '疲',
              pinyin: 'pí',
              meaning: '疲惫；疲劳；累',
              meaningEn: 'tired; weary; exhausted',
              example: '疲劳',
              examplePinyin: 'pí láo',
              exampleMeaning: 'fatigue; tired',
              examples: ["疲劳","疲惫","疲倦"]
            },
          ]
        },
        {
          number: 13,
          unit: 5,
          title: '画杨桃',
          words: [
            {
              char: '图',
              pinyin: 'tú',
              meaning: '图画；地图；图形',
              meaningEn: 'picture; map; diagram',
              example: '图画',
              examplePinyin: 'tú huà',
              exampleMeaning: 'drawing; picture',
              examples: ["图画","地图","图案"]
            },
            {
              char: '课',
              pinyin: 'kè',
              meaning: '课堂；上课；课程',
              meaningEn: 'class; lesson; course',
              example: '上课',
              examplePinyin: 'shàng kè',
              exampleMeaning: 'to attend class',
              examples: ["上课","课程","课堂"]
            },
            {
              char: '摆',
              pinyin: 'bǎi',
              meaning: '放置；摆动；陈列',
              meaningEn: 'to place; to arrange; to swing',
              example: '摆放',
              examplePinyin: 'bǎi fàng',
              exampleMeaning: 'to place; to arrange',
              examples: ["摆放","摆动","摆摊"]
            },
            {
              char: '座',
              pinyin: 'zuò',
              meaning: '座位；位置',
              meaningEn: 'seat; base; measure word for large objects',
              example: '座位',
              examplePinyin: 'zuò wèi',
              exampleMeaning: 'seat; place',
              examples: ["座位","讲座","座椅"]
            },
            {
              char: '室',
              pinyin: 'shì',
              meaning: '房间；教室；办公室',
              meaningEn: 'room; chamber; office',
              example: '教室',
              examplePinyin: 'jiào shì',
              exampleMeaning: 'classroom',
              examples: ["教室","卧室","办公室"]
            },
            {
              char: '交',
              pinyin: 'jiāo',
              meaning: '交给；交叉；交朋友',
              meaningEn: 'to hand over; to cross; to make friends',
              example: '交给',
              examplePinyin: 'jiāo gěi',
              exampleMeaning: 'to hand over to',
              examples: ["交流","交朋友","交给"]
            },
            {
              char: '哈',
              pinyin: 'hā',
              meaning: '笑声；哈哈大笑',
              meaningEn: 'ha (laughing sound)',
              example: '哈哈',
              examplePinyin: 'hā hā',
              exampleMeaning: 'haha (laughter)',
              examples: ["哈哈","哈哈大笑"]
            },
            {
              char: '页',
              pinyin: 'yè',
              meaning: '书页；页面',
              meaningEn: 'page (of a book)',
              example: '页面',
              examplePinyin: 'yè miàn',
              exampleMeaning: 'page; screen',
              examples: ["书页","页面","一页"]
            },
            {
              char: '抢',
              pinyin: 'qiǎng',
              meaning: '抢先；争夺；抢答',
              meaningEn: 'to snatch; to grab; to compete',
              example: '抢着',
              examplePinyin: 'qiǎng zhe',
              exampleMeaning: 'eagerly competing to',
              examples: ["抢先","争抢","抢着"]
            },
            {
              char: '嘻',
              pinyin: 'xī',
              meaning: '嘻嘻；笑声',
              meaningEn: 'hee hee (giggling sound)',
              example: '嘻嘻',
              examplePinyin: 'xī xī',
              exampleMeaning: 'hee hee (giggling)',
              examples: ["嘻嘻","嘻嘻哈哈"]
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
