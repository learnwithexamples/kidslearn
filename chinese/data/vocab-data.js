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
              char: '烧',
              pinyin: 'shāo',
              meaning: '加热烹调；燃烧',
              meaningEn: 'to cook; to roast; to burn',
              example: '红烧',
              examplePinyin: 'hóng shāo',
              exampleMeaning: 'red-braised; braised in soy sauce',
              examples: ["红烧","烧烤","烧饭"]
            },
            {
              char: '烤',
              pinyin: 'kǎo',
              meaning: '用火或热气烹制食物',
              meaningEn: 'to roast; to grill; to bake',
              example: '烧烤',
              examplePinyin: 'shāo kǎo',
              exampleMeaning: 'barbecue; grilled food',
              examples: ["烧烤","烤鸭","烤肉"]
            },
            {
              char: '肉',
              pinyin: 'ròu',
              meaning: '动物或人体的肌肉组织',
              meaningEn: 'meat; flesh',
              example: '猪肉',
              examplePinyin: 'zhū ròu',
              exampleMeaning: 'pork',
              examples: ["猪肉","牛肉","烤肉"]
            },
            {
              char: '蛋',
              pinyin: 'dàn',
              meaning: '鸟类或爬行动物产的卵',
              meaningEn: 'egg',
              example: '鸡蛋',
              examplePinyin: 'jī dàn',
              exampleMeaning: 'chicken egg',
              examples: ["鸡蛋","蛋糕","炒蛋"]
            },
            {
              char: '饭',
              pinyin: 'fàn',
              meaning: '煮熟的米；一餐',
              meaningEn: 'cooked rice; meal',
              example: '米饭',
              examplePinyin: 'mǐ fàn',
              exampleMeaning: 'cooked rice',
              examples: ["米饭","炒饭","吃饭"]
            },
            {
              char: '茄',
              pinyin: 'qié',
              meaning: '茄子；茄科植物',
              meaningEn: 'eggplant; aubergine',
              example: '茄子',
              examplePinyin: 'qié zi',
              exampleMeaning: 'eggplant; aubergine',
              examples: ["茄子","番茄","炒茄子"]
            },
            {
              char: '鸭',
              pinyin: 'yā',
              meaning: '一种水禽；家禽',
              meaningEn: 'duck',
              example: '烤鸭',
              examplePinyin: 'kǎo yā',
              exampleMeaning: 'roast duck (Peking duck)',
              examples: ["烤鸭","鸭蛋","北京烤鸭"]
            },
            {
              char: '鸡',
              pinyin: 'jī',
              meaning: '一种常见家禽',
              meaningEn: 'chicken',
              example: '鸡肉',
              examplePinyin: 'jī ròu',
              exampleMeaning: 'chicken meat',
              examples: ["鸡肉","鸡蛋","炸鸡"]
            },
            {
              char: '炒',
              pinyin: 'chǎo',
              meaning: '用油在锅里快速翻炒',
              meaningEn: 'to stir-fry; to sauté',
              example: '炒菜',
              examplePinyin: 'chǎo cài',
              exampleMeaning: 'stir-fried vegetables; cooked dish',
              examples: ["炒菜","炒饭","炒蛋"]
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
        {
          number: 14,
          unit: 5,
          title: '小马过河',
          words: [
            {
              char: '棚',
              pinyin: 'péng',
              meaning: '用木料或竹子搭成的简易房屋或遮盖物',
              meaningEn: 'shed; shack; shelter',
              example: '马棚',
              examplePinyin: 'mǎ péng',
              exampleMeaning: 'horse stable / shed',
              examples: ["马棚","棚子","搭棚"]
            },
            {
              char: '驼',
              pinyin: 'tuó',
              meaning: '骆驼；背部隆起',
              meaningEn: 'camel; hunchbacked',
              example: '骆驼',
              examplePinyin: 'luò tuó',
              exampleMeaning: 'camel',
              examples: ["骆驼","驼背","驼峰"]
            },
            {
              char: '磨',
              pinyin: 'mò',
              meaning: '石磨；研磨；磨坊',
              meaningEn: 'millstone; to grind; mill',
              example: '磨坊',
              examplePinyin: 'mò fáng',
              exampleMeaning: 'flour mill',
              examples: ["磨坊","石磨","磨面"]
            },
            {
              char: '坊',
              pinyin: 'fāng',
              meaning: '作坊；小工场；街坊',
              meaningEn: 'workshop; mill; neighborhood',
              example: '磨坊',
              examplePinyin: 'mò fáng',
              exampleMeaning: 'flour mill',
              examples: ["磨坊","作坊","街坊"]
            },
            {
              char: '挡',
              pinyin: 'dǎng',
              meaning: '阻挡；遮住；拦截',
              meaningEn: 'to block; to obstruct; to shield',
              example: '阻挡',
              examplePinyin: 'zǔ dǎng',
              exampleMeaning: 'to block; to obstruct',
              examples: ["阻挡","挡住","遮挡"]
            },
            {
              char: '伯',
              pinyin: 'bó',
              meaning: '父亲的哥哥；对年长男性的称呼',
              meaningEn: "father's elder brother; uncle",
              example: '老伯',
              examplePinyin: 'lǎo bó',
              exampleMeaning: 'elderly uncle; old man (polite)',
              examples: ["伯伯","老伯","伯父"]
            },
            {
              char: '浅',
              pinyin: 'qiǎn',
              meaning: '深度不大；颜色淡；简单',
              meaningEn: 'shallow; light (color); simple',
              example: '浅水',
              examplePinyin: 'qiǎn shuǐ',
              exampleMeaning: 'shallow water',
              examples: ["浅水","深浅","浅色"]
            },
            {
              char: '刻',
              pinyin: 'kè',
              meaning: '雕刻；时刻；严格',
              meaningEn: 'to carve; moment; strict',
              example: '立刻',
              examplePinyin: 'lì kè',
              exampleMeaning: 'immediately; at once',
              examples: ["立刻","时刻","深刻"]
            },
            {
              char: '突',
              pinyin: 'tū',
              meaning: '突然；冒出；突破',
              meaningEn: 'sudden; to burst out; to protrude',
              example: '突然',
              examplePinyin: 'tū rán',
              exampleMeaning: 'suddenly; all of a sudden',
              examples: ["突然","突破","冲突"]
            },
            {
              char: '叹',
              pinyin: 'tàn',
              meaning: '叹气；感叹',
              meaningEn: 'to sigh; to exclaim',
              example: '叹气',
              examplePinyin: 'tàn qì',
              exampleMeaning: 'to sigh',
              examples: ["叹气","感叹","叹息"]
            },
            {
              char: '唉',
              pinyin: 'āi',
              meaning: '叹词，表示伤感或无奈',
              meaningEn: 'alas; oh (sigh of resignation)',
              example: '唉声叹气',
              examplePinyin: 'āi shēng tàn qì',
              exampleMeaning: 'to moan and groan; to sigh repeatedly',
              examples: ["唉声叹气","唉呀","唉"]
            },
            {
              char: '试',
              pinyin: 'shì',
              meaning: '试验；尝试；考试',
              meaningEn: 'to try; to test; exam',
              example: '试试',
              examplePinyin: 'shì shì',
              exampleMeaning: 'to give it a try',
              examples: ["试试","尝试","考试"]
            },
            {
              char: '蹄',
              pinyin: 'tí',
              meaning: '动物的脚掌',
              meaningEn: 'hoof',
              example: '马蹄',
              examplePinyin: 'mǎ tí',
              exampleMeaning: 'horse hoof',
              examples: ["马蹄","蹄子","猪蹄"]
            },
            {
              char: '既',
              pinyin: 'jì',
              meaning: '既然；已经；既…又…',
              meaningEn: 'since; already; both…and…',
              example: '既然',
              examplePinyin: 'jì rán',
              exampleMeaning: 'since; now that',
              examples: ["既然","既…又…","早已"]
            },
            {
              char: '愿',
              pinyin: 'yuàn',
              meaning: '愿意；心愿；志愿',
              meaningEn: 'willing; wish; desire',
              example: '愿意',
              examplePinyin: 'yuàn yì',
              exampleMeaning: 'willing; to be willing to',
              examples: ["愿意","心愿","志愿"]
            },
            {
              char: '麦',
              pinyin: 'mài',
              meaning: '麦子；小麦；大麦',
              meaningEn: 'wheat; barley',
              example: '小麦',
              examplePinyin: 'xiǎo mài',
              exampleMeaning: 'wheat',
              examples: ["小麦","麦子","麦田"]
            },
            {
              char: '意',
              pinyin: 'yì',
              meaning: '意思；意义；注意',
              meaningEn: 'meaning; idea; intention',
              example: '意思',
              examplePinyin: 'yì si',
              exampleMeaning: 'meaning; idea; interesting',
              examples: ["意思","注意","意义"]
            },
            {
              char: '该',
              pinyin: 'gāi',
              meaning: '应该；该…了',
              meaningEn: 'should; ought to',
              example: '应该',
              examplePinyin: 'yīng gāi',
              exampleMeaning: 'should; ought to',
              examples: ["应该","该怎么","该去"]
            },
            {
              char: '掉',
              pinyin: 'diào',
              meaning: '落下；丢失；掉落',
              meaningEn: 'to fall; to drop; to lose',
              example: '掉下',
              examplePinyin: 'diào xià',
              exampleMeaning: 'to fall down; to drop',
              examples: ["掉下","掉落","丢掉"]
            },
          ]
        },
        {
          number: 15,
          unit: 6,
          title: '古诗二首',
          words: [
            {
              char: '晓',
              pinyin: 'xiǎo',
              meaning: '天刚亮；知道；清楚',
              meaningEn: 'dawn; to know; to understand',
              example: '拂晓',
              examplePinyin: 'fú xiǎo',
              exampleMeaning: 'before dawn; at daybreak',
              examples: ["拂晓","晓得","知晓"]
            },
            {
              char: '慈',
              pinyin: 'cí',
              meaning: '慈爱；仁慈；慈祥',
              meaningEn: 'kind; loving; compassionate',
              example: '慈祥',
              examplePinyin: 'cí xiáng',
              exampleMeaning: 'kindly; benevolent (of elderly)',
              examples: ["慈祥","仁慈","慈爱"]
            },
            {
              char: '毕',
              pinyin: 'bì',
              meaning: '完毕；毕竟；毕业',
              meaningEn: 'to finish; after all; graduate',
              example: '毕竟',
              examplePinyin: 'bì jìng',
              exampleMeaning: 'after all; in the end',
              examples: ["毕竟","毕业","完毕"]
            },
            {
              char: '竟',
              pinyin: 'jìng',
              meaning: '竟然；终究；毕竟',
              meaningEn: 'unexpectedly; after all; to the end',
              example: '竟然',
              examplePinyin: 'jìng rán',
              exampleMeaning: 'unexpectedly; to one\'s surprise',
              examples: ["竟然","毕竟","究竟"]
            },
            {
              char: '映',
              pinyin: 'yìng',
              meaning: '反映；映照；放映',
              meaningEn: 'to reflect; to shine upon; to project',
              example: '映照',
              examplePinyin: 'yìng zhào',
              exampleMeaning: 'to illuminate; to reflect light on',
              examples: ["映照","反映","放映"]
            },
            {
              char: '绝',
              pinyin: 'jué',
              meaning: '绝对；绝妙；断绝',
              meaningEn: 'absolute; superb; to cut off',
              example: '绝妙',
              examplePinyin: 'jué miào',
              exampleMeaning: 'absolutely wonderful; superb',
              examples: ["绝妙","绝对","绝句"]
            },
            {
              char: '鹂',
              pinyin: 'lí',
              meaning: '黄鹂；一种鸣叫悦耳的鸟',
              meaningEn: 'oriole (bird)',
              example: '黄鹂',
              examplePinyin: 'huáng lí',
              exampleMeaning: 'oriole; yellow bird',
              examples: ["黄鹂","黄鹂鸟"]
            },
            {
              char: '鸣',
              pinyin: 'míng',
              meaning: '鸟叫；发出声音',
              meaningEn: 'to chirp; to cry (of birds); to sound',
              example: '鸣叫',
              examplePinyin: 'míng jiào',
              exampleMeaning: 'to chirp; to cry out',
              examples: ["鸣叫","鸟鸣","共鸣"]
            },
            {
              char: '行',
              pinyin: 'háng',
              meaning: '排列成行；行列',
              meaningEn: 'row; line (of text or objects)',
              example: '一行',
              examplePinyin: 'yī háng',
              exampleMeaning: 'a row; a line',
              examples: ["一行","行列","银行"]
            },
            {
              char: '含',
              pinyin: 'hán',
              meaning: '含有；含义；包含',
              meaningEn: 'to contain; to hold in mouth; to include',
              example: '含义',
              examplePinyin: 'hán yì',
              exampleMeaning: 'meaning; implication',
              examples: ["含义","包含","含有"]
            },
            {
              char: '岭',
              pinyin: 'lǐng',
              meaning: '山岭；山脉',
              meaningEn: 'mountain ridge; mountain range',
              example: '山岭',
              examplePinyin: 'shān lǐng',
              exampleMeaning: 'mountain ridge',
              examples: ["山岭","岭南","翻山越岭"]
            },
            {
              char: '泊',
              pinyin: 'bó',
              meaning: '停泊；淡泊；湖泊',
              meaningEn: 'to moor; lake; indifferent to fame',
              example: '停泊',
              examplePinyin: 'tíng bó',
              exampleMeaning: 'to anchor; to moor',
              examples: ["停泊","湖泊","淡泊"]
            },
            {
              char: '湖',
              pinyin: 'hú',
              meaning: '湖泊；大片水域',
              meaningEn: 'lake',
              example: '湖泊',
              examplePinyin: 'hú pō',
              exampleMeaning: 'lakes',
              examples: ["湖泊","湖水","西湖"]
            },
            {
              char: '穷',
              pinyin: 'qióng',
              meaning: '穷尽；贫穷；无穷',
              meaningEn: 'poor; exhausted; endless',
              example: '无穷',
              examplePinyin: 'wú qióng',
              exampleMeaning: 'endless; infinite',
              examples: ["无穷","穷尽","贫穷"]
            },
            {
              char: '莲',
              pinyin: 'lián',
              meaning: '莲花；荷花；莲藕',
              meaningEn: 'lotus flower',
              example: '莲花',
              examplePinyin: 'lián huā',
              exampleMeaning: 'lotus flower',
              examples: ["莲花","莲藕","莲子"]
            },
            {
              char: '荷',
              pinyin: 'hé',
              meaning: '荷花；荷叶；荷塘',
              meaningEn: 'lotus; water lily',
              example: '荷花',
              examplePinyin: 'hé huā',
              exampleMeaning: 'lotus flower',
              examples: ["荷花","荷叶","荷塘"]
            },
            {
              char: '吴',
              pinyin: 'wú',
              meaning: '古代国名；姓吴；吴地（江苏一带）',
              meaningEn: 'Wu (ancient kingdom / place name); surname Wu',
              example: '吴地',
              examplePinyin: 'wú dì',
              exampleMeaning: 'the Wu region (Jiangsu area)',
              examples: ["吴地","姑苏","吴语"]
            },
          ]
        },
        {
          number: 16,
          unit: 6,
          title: '雷雨',
          words: [
            {
              char: '压',
              pinyin: 'yā',
              meaning: '压低；压迫；重压',
              meaningEn: 'to press down; to weigh on; pressure',
              example: '压低',
              examplePinyin: 'yā dī',
              exampleMeaning: 'to press down; to lower',
              examples: ["压低","气压","压力"]
            },
            {
              char: '蝉',
              pinyin: 'chán',
              meaning: '一种夏天鸣叫的昆虫；知了',
              meaningEn: 'cicada',
              example: '知了',
              examplePinyin: 'zhī liǎo',
              exampleMeaning: 'cicada (colloquial name)',
              examples: ["知了","蝉鸣","金蝉"]
            },
            {
              char: '垂',
              pinyin: 'chuí',
              meaning: '向下弯曲；垂落；悬挂',
              meaningEn: 'to hang down; to droop; to lower',
              example: '垂下',
              examplePinyin: 'chuí xià',
              exampleMeaning: 'to hang down; to droop',
              examples: ["垂下","垂柳","垂直"]
            },
            {
              char: '户',
              pinyin: 'hù',
              meaning: '门；住户；窗户',
              meaningEn: 'door; household; window',
              example: '窗户',
              examplePinyin: 'chuāng hu',
              exampleMeaning: 'window',
              examples: ["窗户","住户","门户"]
            },
            {
              char: '扑',
              pinyin: 'pū',
              meaning: '扑向；扑打；扑面',
              meaningEn: 'to rush at; to pounce; to flap',
              example: '扑过来',
              examplePinyin: 'pū guò lái',
              exampleMeaning: 'to rush/pounce toward',
              examples: ["扑过来","扑打","扑面"]
            },
            {
              char: '雷',
              pinyin: 'léi',
              meaning: '打雷；雷声；雷电',
              meaningEn: 'thunder',
              example: '打雷',
              examplePinyin: 'dǎ léi',
              exampleMeaning: 'thunder (verb)',
              examples: ["打雷","雷声","雷雨"]
            },
            {
              char: '黑',
              pinyin: 'hēi',
              meaning: '黑色；天黑；黑暗',
              meaningEn: 'black; dark',
              example: '乌黑',
              examplePinyin: 'wū hēi',
              exampleMeaning: 'jet black; pitch black',
              examples: ["乌黑","黑暗","天黑"]
            },
            {
              char: '新',
              pinyin: 'xīn',
              meaning: '新鲜；全新；新的',
              meaningEn: 'new; fresh; novel',
              example: '新鲜',
              examplePinyin: 'xīn xiān',
              exampleMeaning: 'fresh; novel',
              examples: ["新鲜","全新","崭新"]
            },
            {
              char: '乌',
              pinyin: 'wū',
              meaning: '黑色；乌云；乌鸦',
              meaningEn: 'black; dark; crow',
              example: '乌云',
              examplePinyin: 'wū yún',
              exampleMeaning: 'dark clouds',
              examples: ["乌云","乌黑","乌鸦"]
            },
            {
              char: '迎',
              pinyin: 'yíng',
              meaning: '迎接；迎面；欢迎',
              meaningEn: 'to welcome; to face; to greet',
              example: '迎接',
              examplePinyin: 'yíng jiē',
              exampleMeaning: 'to welcome; to greet',
              examples: ["迎接","欢迎","迎面"]
            },
          ]
        },
        {
          number: 17,
          unit: 6,
          title: '要是你在野外迷了路',
          words: [
            {
              char: '慌',
              pinyin: 'huāng',
              meaning: '慌张；慌忙；惊慌',
              meaningEn: 'flustered; panic; hurried',
              example: '惊慌',
              examplePinyin: 'jīng huāng',
              exampleMeaning: 'panic; alarmed',
              examples: ["惊慌","慌张","慌忙"]
            },
            {
              char: '辨',
              pinyin: 'biàn',
              meaning: '辨别；辨认；分辨',
              meaningEn: 'to distinguish; to identify; to discern',
              example: '辨别',
              examplePinyin: 'biàn bié',
              exampleMeaning: 'to distinguish; to differentiate',
              examples: ["辨别","分辨","辨认"]
            },
            {
              char: '忠',
              pinyin: 'zhōng',
              meaning: '忠实；忠诚；忠心',
              meaningEn: 'loyal; faithful; devoted',
              example: '忠实',
              examplePinyin: 'zhōng shí',
              exampleMeaning: 'faithful; loyal; true',
              examples: ["忠实","忠诚","忠心"]
            },
            {
              char: '实',
              pinyin: 'shí',
              meaning: '真实；实际；忠实',
              meaningEn: 'real; solid; true; actual',
              example: '真实',
              examplePinyin: 'zhēn shí',
              exampleMeaning: 'real; true; genuine',
              examples: ["真实","实际","忠实"]
            },
            {
              char: '导',
              pinyin: 'dǎo',
              meaning: '向导；引导；指导',
              meaningEn: 'to guide; to lead; to direct',
              example: '向导',
              examplePinyin: 'xiàng dǎo',
              exampleMeaning: 'guide; pathfinder',
              examples: ["向导","引导","指导"]
            },
            {
              char: '盏',
              pinyin: 'zhǎn',
              meaning: '小杯；灯盏；一盏灯',
              meaningEn: 'small cup; lamp; (measure word for lamps)',
              example: '一盏灯',
              examplePinyin: 'yī zhǎn dēng',
              exampleMeaning: 'a (single) lamp',
              examples: ["一盏灯","灯盏","两盏"]
            },
            {
              char: '永',
              pinyin: 'yǒng',
              meaning: '永远；永久；永恒',
              meaningEn: 'forever; permanent; eternal',
              example: '永远',
              examplePinyin: 'yǒng yuǎn',
              exampleMeaning: 'forever; always',
              examples: ["永远","永久","永恒"]
            },
            {
              char: '闯',
              pinyin: 'chuǎng',
              meaning: '闯入；闯过；闯关',
              meaningEn: 'to rush in; to break through; to forge ahead',
              example: '闯过',
              examplePinyin: 'chuǎng guò',
              exampleMeaning: 'to break through; to get past',
              examples: ["闯过","闯入","闯关"]
            },
            {
              char: '碰',
              pinyin: 'pèng',
              meaning: '碰到；碰见；碰撞',
              meaningEn: 'to touch; to bump into; to meet by chance',
              example: '碰到',
              examplePinyin: 'pèng dào',
              exampleMeaning: 'to bump into; to encounter',
              examples: ["碰到","碰见","碰撞"]
            },
            {
              char: '稠',
              pinyin: 'chóu',
              meaning: '稠密；浓稠；稠厚',
              meaningEn: 'dense; thick; concentrated',
              example: '稠密',
              examplePinyin: 'chóu mì',
              exampleMeaning: 'dense; thick',
              examples: ["稠密","浓稠","稠厚"]
            },
            {
              char: '稀',
              pinyin: 'xī',
              meaning: '稀少；稀疏；稀有',
              meaningEn: 'sparse; rare; thin; scarce',
              example: '稀少',
              examplePinyin: 'xī shǎo',
              exampleMeaning: 'scarce; sparse; rare',
              examples: ["稀少","稀疏","稀有"]
            },
            {
              char: '渠',
              pinyin: 'qú',
              meaning: '水渠；沟渠；渠道',
              meaningEn: 'canal; ditch; irrigation channel',
              example: '水渠',
              examplePinyin: 'shuǐ qú',
              exampleMeaning: 'canal; irrigation ditch',
              examples: ["水渠","沟渠","渠道"]
            },
            {
              char: '积',
              pinyin: 'jī',
              meaning: '积累；积雪；积水',
              meaningEn: 'to accumulate; to pile up; accumulated',
              example: '积累',
              examplePinyin: 'jī lěi',
              exampleMeaning: 'to accumulate; accumulation',
              examples: ["积累","积雪","积水"]
            },
            {
              char: '指',
              pinyin: 'zhǐ',
              meaning: '指向；指路；手指',
              meaningEn: 'to point; to indicate; finger',
              example: '指路',
              examplePinyin: 'zhǐ lù',
              exampleMeaning: 'to give directions; to show the way',
              examples: ["指路","指向","手指"]
            },
            {
              char: '帮',
              pinyin: 'bāng',
              meaning: '帮助；帮忙；帮手',
              meaningEn: 'to help; to assist; helper',
              example: '帮助',
              examplePinyin: 'bāng zhù',
              exampleMeaning: 'to help; assistance',
              examples: ["帮助","帮忙","帮手"]
            },
            {
              char: '针',
              pinyin: 'zhēn',
              meaning: '指南针；针线；针头',
              meaningEn: 'needle; compass needle; pin',
              example: '指南针',
              examplePinyin: 'zhǐ nán zhēn',
              exampleMeaning: 'compass',
              examples: ["指南针","针线","缝衣针"]
            },
            {
              char: '助',
              pinyin: 'zhù',
              meaning: '帮助；助手；援助',
              meaningEn: 'to assist; to aid; helper',
              example: '帮助',
              examplePinyin: 'bāng zhù',
              exampleMeaning: 'to help; assistance',
              examples: ["帮助","援助","助手"]
            },
            {
              char: '特',
              pinyin: 'tè',
              meaning: '特别；特殊；特点',
              meaningEn: 'special; particular; unique',
              example: '特别',
              examplePinyin: 'tè bié',
              exampleMeaning: 'special; especially; particularly',
              examples: ["特别","特殊","特点"]
            },
          ]
        },
        {
          number: 18,
          unit: 6,
          title: '太空生活趣事多',
          words: [
            {
              char: '航',
              pinyin: 'háng',
              meaning: '航天；航行；航空',
              meaningEn: 'to navigate; aviation; spaceflight',
              example: '航天',
              examplePinyin: 'háng tiān',
              exampleMeaning: 'spaceflight; astronautics',
              examples: ["航天","航行","航空"]
            },
            {
              char: '宇',
              pinyin: 'yǔ',
              meaning: '宇宙；宇航员；宇宙飞船',
              meaningEn: 'universe; space',
              example: '宇宙',
              examplePinyin: 'yǔ zhòu',
              exampleMeaning: 'universe; cosmos',
              examples: ["宇宙","宇航员","宇宙飞船"]
            },
            {
              char: '宙',
              pinyin: 'zhòu',
              meaning: '宇宙；宙斯',
              meaningEn: 'universe; time (all time)',
              example: '宇宙',
              examplePinyin: 'yǔ zhòu',
              exampleMeaning: 'universe; cosmos',
              examples: ["宇宙","太宙","宙斯"]
            },
            {
              char: '稳',
              pinyin: 'wěn',
              meaning: '稳定；平稳；稳固',
              meaningEn: 'stable; steady; firm',
              example: '稳定',
              examplePinyin: 'wěn dìng',
              exampleMeaning: 'stable; steady',
              examples: ["稳定","平稳","稳固"]
            },
            {
              char: '固',
              pinyin: 'gù',
              meaning: '固定；牢固；稳固',
              meaningEn: 'fixed; firm; solid; secure',
              example: '固定',
              examplePinyin: 'gù dìng',
              exampleMeaning: 'fixed; to fasten; to secure',
              examples: ["固定","牢固","稳固"]
            },
            {
              char: '舱',
              pinyin: 'cāng',
              meaning: '舱室；太空舱；飞船舱',
              meaningEn: 'cabin; module; compartment (of a spacecraft)',
              example: '太空舱',
              examplePinyin: 'tài kōng cāng',
              exampleMeaning: 'space capsule; spacecraft module',
              examples: ["太空舱","飞船舱","舱室"]
            },
            {
              char: '杯',
              pinyin: 'bēi',
              meaning: '水杯；杯子；茶杯',
              meaningEn: 'cup; glass; mug',
              example: '水杯',
              examplePinyin: 'shuǐ bēi',
              exampleMeaning: 'water cup; drinking glass',
              examples: ["水杯","杯子","茶杯"]
            },
            {
              char: '饮',
              pinyin: 'yǐn',
              meaning: '饮水；饮料；饮食',
              meaningEn: 'to drink; beverage; drinking',
              example: '饮水',
              examplePinyin: 'yǐn shuǐ',
              exampleMeaning: 'to drink water',
              examples: ["饮水","饮料","饮食"]
            },
            {
              char: '件',
              pinyin: 'jiàn',
              meaning: '物件；条件；件数',
              meaningEn: 'item; piece; matter; (measure word for things)',
              example: '物件',
              examplePinyin: 'wù jiàn',
              exampleMeaning: 'object; item; article',
              examples: ["物件","条件","一件事"]
            },
            {
              char: '题',
              pinyin: 'tí',
              meaning: '问题；题目；难题',
              meaningEn: 'question; topic; problem; title',
              example: '问题',
              examplePinyin: 'wèn tí',
              exampleMeaning: 'question; problem; issue',
              examples: ["问题","题目","难题"]
            },
            {
              char: '密',
              pinyin: 'mì',
              meaning: '密封；严密；秘密',
              meaningEn: 'sealed; dense; secret; tight',
              example: '密封',
              examplePinyin: 'mì fēng',
              exampleMeaning: 'to seal airtight; sealed',
              examples: ["密封","严密","秘密"]
            },
            {
              char: '浴',
              pinyin: 'yù',
              meaning: '洗澡；浴室；沐浴',
              meaningEn: 'to bathe; bath; bathing',
              example: '浴室',
              examplePinyin: 'yù shì',
              exampleMeaning: 'bathroom; bath room',
              examples: ["浴室","沐浴","浴缸"]
            },
            {
              char: '桶',
              pinyin: 'tǒng',
              meaning: '水桶；桶装；一桶',
              meaningEn: 'bucket; barrel; pail',
              example: '水桶',
              examplePinyin: 'shuǐ tǒng',
              exampleMeaning: 'water bucket; pail',
              examples: ["水桶","桶装","一桶水"]
            },
            {
              char: '洗',
              pinyin: 'xǐ',
              meaning: '洗澡；洗手；洗脸',
              meaningEn: 'to wash; to rinse; to clean',
              example: '洗澡',
              examplePinyin: 'xǐ zǎo',
              exampleMeaning: 'to take a bath/shower',
              examples: ["洗澡","洗手","洗脸"]
            },
            {
              char: '容',
              pinyin: 'róng',
              meaning: '容易；容纳；容器',
              meaningEn: 'easy; to contain; to hold; appearance',
              example: '容易',
              examplePinyin: 'róng yì',
              exampleMeaning: 'easy; simple',
              examples: ["容易","容纳","容器"]
            },
            {
              char: '失',
              pinyin: 'shī',
              meaning: '失重；失去；丢失',
              meaningEn: 'to lose; to miss; weightlessness',
              example: '失重',
              examplePinyin: 'shī zhòng',
              exampleMeaning: 'weightlessness; zero gravity',
              examples: ["失重","失去","丢失"]
            },
            {
              char: '澡',
              pinyin: 'zǎo',
              meaning: '洗澡；澡堂；沐浴',
              meaningEn: 'bath; bathing',
              example: '洗澡',
              examplePinyin: 'xǐ zǎo',
              exampleMeaning: 'to take a bath/shower',
              examples: ["洗澡","澡堂","泡澡"]
            },
            {
              char: '易',
              pinyin: 'yì',
              meaning: '容易；简易；不易',
              meaningEn: 'easy; simple; to change',
              example: '容易',
              examplePinyin: 'róng yì',
              exampleMeaning: 'easy; simple',
              examples: ["容易","简易","不易"]
            },
          ]
        },
        {
          number: 19,
          unit: 7,
          title: '大象的耳朵',
          words: [
            {
              char: '似',
              pinyin: 'shì',
              meaning: '似乎；好似；似的',
              meaningEn: 'to seem; like; as if (pronunciation: shì in 似的)',
              example: '似的',
              examplePinyin: 'shì de',
              exampleMeaning: 'like; similar to; just like',
              examples: ["似的","好似","似乎"]
            },
            {
              char: '耷',
              pinyin: 'dā',
              meaning: '耷拉；耷着耳朵',
              meaningEn: 'to droop; to hang down (ears)',
              example: '耷拉',
              examplePinyin: 'dā la',
              exampleMeaning: 'to droop; to hang down limply',
              examples: ["耷拉","耷着耳朵","耷拉着脑袋"]
            },
            {
              char: '咦',
              pinyin: 'yí',
              meaning: '咦！表示惊讶',
              meaningEn: 'hey! oh! (exclamation of surprise)',
              example: '咦',
              examplePinyin: 'yí',
              exampleMeaning: 'hey! (expression of surprise)',
              examples: ["咦，真奇怪","咦！","咦，是吗"]
            },
            {
              char: '竖',
              pinyin: 'shù',
              meaning: '竖起；竖立；横竖',
              meaningEn: 'to erect; vertical; upright',
              example: '竖起',
              examplePinyin: 'shù qǐ',
              exampleMeaning: 'to stand up; to erect; to prick up',
              examples: ["竖起","竖立","横竖"]
            },
            {
              char: '竿',
              pinyin: 'gān',
              meaning: '旗竿；百尺竿头；竹竿',
              meaningEn: 'pole; rod; bamboo pole',
              example: '旗竿',
              examplePinyin: 'qí gān',
              exampleMeaning: 'flagpole',
              examples: ["旗竿","竹竿","百尺竿头"]
            },
            {
              char: '舞',
              pinyin: 'wǔ',
              meaning: '舞动；跳舞；舞蹈',
              meaningEn: 'to dance; to wave; dance',
              example: '跳舞',
              examplePinyin: 'tiào wǔ',
              exampleMeaning: 'to dance',
              examples: ["跳舞","舞蹈","舞动"]
            },
            {
              char: '痛',
              pinyin: 'tòng',
              meaning: '疼痛；痛苦；头痛',
              meaningEn: 'pain; ache; painful',
              example: '疼痛',
              examplePinyin: 'téng tòng',
              exampleMeaning: 'pain; ache; soreness',
              examples: ["疼痛","痛苦","头痛"]
            },
            {
              char: '烦',
              pinyin: 'fán',
              meaning: '烦恼；麻烦；烦躁',
              meaningEn: 'annoyed; troubled; vexed',
              example: '烦恼',
              examplePinyin: 'fán nǎo',
              exampleMeaning: 'worry; annoyance; trouble',
              examples: ["烦恼","麻烦","烦躁"]
            },
            {
              char: '扇',
              pinyin: 'shān',
              meaning: '扇动；扇风；扇耳光',
              meaningEn: 'to fan; to flap; to slap (pronunciation: shān as verb)',
              example: '扇风',
              examplePinyin: 'shān fēng',
              exampleMeaning: 'to fan air; to wave a fan',
              examples: ["扇风","扇动","扇耳光"]
            },
            {
              char: '遇',
              pinyin: 'yù',
              meaning: '遇到；遭遇；相遇',
              meaningEn: 'to meet; to encounter; to come across',
              example: '遇到',
              examplePinyin: 'yù dào',
              exampleMeaning: 'to encounter; to run into',
              examples: ["遇到","相遇","遭遇"]
            },
            {
              char: '安',
              pinyin: 'ān',
              meaning: '安静；平安；安心',
              meaningEn: 'peaceful; calm; safe; comfortable',
              example: '安静',
              examplePinyin: 'ān jìng',
              exampleMeaning: 'quiet; calm; peaceful',
              examples: ["安静","平安","安心"]
            },
            {
              char: '慢',
              pinyin: 'màn',
              meaning: '慢慢；缓慢；慢走',
              meaningEn: 'slow; slowly; leisurely',
              example: '慢慢',
              examplePinyin: 'màn màn',
              exampleMeaning: 'slowly; gradually',
              examples: ["慢慢","缓慢","慢走"]
            },
            {
              char: '兔',
              pinyin: 'tù',
              meaning: '兔子；白兔；野兔',
              meaningEn: 'rabbit; hare',
              example: '兔子',
              examplePinyin: 'tù zi',
              exampleMeaning: 'rabbit',
              examples: ["兔子","白兔","野兔"]
            },
            {
              char: '根',
              pinyin: 'gēn',
              meaning: '根据；树根；根本',
              meaningEn: 'root; basis; (measure word for long thin objects)',
              example: '树根',
              examplePinyin: 'shù gēn',
              exampleMeaning: 'tree root',
              examples: ["树根","根据","根本"]
            },
            {
              char: '最',
              pinyin: 'zuì',
              meaning: '最好；最大；最终',
              meaningEn: 'most; -est (superlative); best',
              example: '最好',
              examplePinyin: 'zuì hǎo',
              exampleMeaning: 'best; it would be best',
              examples: ["最好","最大","最终"]
            },
          ]
        },
        {
          number: 20,
          unit: 7,
          title: '蜘蛛开店',
          words: [
            {
              char: '店',
              pinyin: 'diàn',
              meaning: '商店；开店；店铺',
              meaningEn: 'shop; store',
              example: '商店',
              examplePinyin: 'shāng diàn',
              exampleMeaning: 'shop; store',
              examples: ["商店","开店","店铺"]
            },
            {
              char: '蹲',
              pinyin: 'dūn',
              meaning: '蹲下；蹲着；蹲坐',
              meaningEn: 'to squat; to crouch',
              example: '蹲下',
              examplePinyin: 'dūn xià',
              exampleMeaning: 'to squat down; to crouch down',
              examples: ["蹲下","蹲着","蹲坐"]
            },
            {
              char: '寂',
              pinyin: 'jì',
              meaning: '寂寞；寂静；孤寂',
              meaningEn: 'lonely; quiet; still; desolate',
              example: '寂寞',
              examplePinyin: 'jì mò',
              exampleMeaning: 'lonely; lonesome',
              examples: ["寂寞","寂静","孤寂"]
            },
            {
              char: '寞',
              pinyin: 'mò',
              meaning: '寂寞；落寞；孤寞',
              meaningEn: 'lonely; desolate',
              example: '寂寞',
              examplePinyin: 'jì mò',
              exampleMeaning: 'lonely; lonesome',
              examples: ["寂寞","落寞","孤寞"]
            },
            {
              char: '罩',
              pinyin: 'zhào',
              meaning: '口罩；遮罩；笼罩',
              meaningEn: 'cover; mask; to envelop',
              example: '口罩',
              examplePinyin: 'kǒu zhào',
              exampleMeaning: 'face mask',
              examples: ["口罩","遮罩","笼罩"]
            },
            {
              char: '编',
              pinyin: 'biān',
              meaning: '编织；编写；编排',
              meaningEn: 'to weave; to knit; to compile; to edit',
              example: '编织',
              examplePinyin: 'biān zhī',
              exampleMeaning: 'to weave; to knit',
              examples: ["编织","编写","编排"]
            },
            {
              char: '顾',
              pinyin: 'gù',
              meaning: '顾客；光顾；顾问',
              meaningEn: 'customer; to patronize; to look after',
              example: '顾客',
              examplePinyin: 'gù kè',
              exampleMeaning: 'customer; client',
              examples: ["顾客","光顾","顾问"]
            },
            {
              char: '付',
              pinyin: 'fù',
              meaning: '付钱；支付；付出',
              meaningEn: 'to pay; to hand over; to give',
              example: '付钱',
              examplePinyin: 'fù qián',
              exampleMeaning: 'to pay money',
              examples: ["付钱","支付","付出"]
            },
            {
              char: '夫',
              pinyin: 'fū',
              meaning: '工夫；丈夫；功夫',
              meaningEn: 'man; husband; labor; effort',
              example: '工夫',
              examplePinyin: 'gōng fu',
              exampleMeaning: 'time; effort; skill',
              examples: ["工夫","丈夫","功夫"]
            },
            {
              char: '换',
              pinyin: 'huàn',
              meaning: '换掉；更换；交换',
              meaningEn: 'to exchange; to change; to swap',
              example: '更换',
              examplePinyin: 'gēng huàn',
              exampleMeaning: 'to replace; to change',
              examples: ["更换","交换","换掉"]
            },
            {
              char: '颈',
              pinyin: 'jǐng',
              meaning: '脖颈；颈部；长颈鹿',
              meaningEn: 'neck',
              example: '长颈鹿',
              examplePinyin: 'cháng jǐng lù',
              exampleMeaning: 'giraffe',
              examples: ["长颈鹿","脖颈","颈部"]
            },
            {
              char: '袜',
              pinyin: 'wà',
              meaning: '袜子；长袜；短袜',
              meaningEn: 'socks; stockings',
              example: '袜子',
              examplePinyin: 'wà zi',
              exampleMeaning: 'socks; stockings',
              examples: ["袜子","长袜","短袜"]
            },
            {
              char: '匆',
              pinyin: 'cōng',
              meaning: '匆忙；匆匆；匆促',
              meaningEn: 'hurried; hasty; in a rush',
              example: '匆忙',
              examplePinyin: 'cōng máng',
              exampleMeaning: 'hurried; in a rush; hasty',
              examples: ["匆忙","匆匆","匆促"]
            },
            {
              char: '蜈',
              pinyin: 'wú',
              meaning: '蜈蚣；一种多脚虫',
              meaningEn: 'centipede (first character)',
              example: '蜈蚣',
              examplePinyin: 'wú gōng',
              exampleMeaning: 'centipede',
              examples: ["蜈蚣","大蜈蚣","一条蜈蚣"]
            },
            {
              char: '蚣',
              pinyin: 'gōng',
              meaning: '蜈蚣；多足虫',
              meaningEn: 'centipede (second character)',
              example: '蜈蚣',
              examplePinyin: 'wú gōng',
              exampleMeaning: 'centipede',
              examples: ["蜈蚣","大蜈蚣","一条蜈蚣"]
            },
            {
              char: '定',
              pinyin: 'dìng',
              meaning: '决定；确定；定好',
              meaningEn: 'to decide; fixed; settled; definite',
              example: '决定',
              examplePinyin: 'jué dìng',
              exampleMeaning: 'to decide; decision',
              examples: ["决定","确定","定好"]
            },
            {
              char: '完',
              pinyin: 'wán',
              meaning: '完成；完全；完工',
              meaningEn: 'to finish; complete; done',
              example: '完成',
              examplePinyin: 'wán chéng',
              exampleMeaning: 'to complete; to finish; completion',
              examples: ["完成","完全","完工"]
            },
            {
              char: '期',
              pinyin: 'qī',
              meaning: '期间；日期；假期',
              meaningEn: 'period; time; date; term',
              example: '假期',
              examplePinyin: 'jiǎ qī',
              exampleMeaning: 'holiday; vacation',
              examples: ["假期","日期","期间"]
            },
            {
              char: '决',
              pinyin: 'jué',
              meaning: '决定；决心；决赛',
              meaningEn: 'to decide; definitely; determination',
              example: '决心',
              examplePinyin: 'jué xīn',
              exampleMeaning: 'determination; resolve',
              examples: ["决心","决定","决赛"]
            },
            {
              char: '商',
              pinyin: 'shāng',
              meaning: '商量；商店；商议',
              meaningEn: 'to discuss; commerce; merchant',
              example: '商量',
              examplePinyin: 'shāng liang',
              exampleMeaning: 'to discuss; to consult',
              examples: ["商量","商店","商议"]
            },
            {
              char: '终',
              pinyin: 'zhōng',
              meaning: '终于；最终；始终',
              meaningEn: 'finally; in the end; throughout',
              example: '终于',
              examplePinyin: 'zhōng yú',
              exampleMeaning: 'finally; at last',
              examples: ["终于","最终","始终"]
            },
          ]
        },
        {
          number: 21,
          unit: 7,
          title: '青蛙卖泥塘',
          words: [
            {
              char: '卖',
              pinyin: 'mài',
              meaning: '卖掉；出卖；买卖',
              meaningEn: 'to sell',
              example: '卖掉',
              examplePinyin: 'mài diào',
              exampleMeaning: 'to sell off',
              examples: ["卖掉","出卖","买卖"]
            },
            {
              char: '烂',
              pinyin: 'làn',
              meaning: '烂泥；腐烂；破烂',
              meaningEn: 'rotten; muddy; messy; worn out',
              example: '烂泥',
              examplePinyin: 'làn ní',
              exampleMeaning: 'mud; mire',
              examples: ["烂泥","腐烂","破烂"]
            },
            {
              char: '牌',
              pinyin: 'pái',
              meaning: '牌子；广告牌；招牌',
              meaningEn: 'sign; board; brand; card',
              example: '招牌',
              examplePinyin: 'zhāo pai',
              exampleMeaning: 'signboard; shop sign',
              examples: ["招牌","广告牌","牌子"]
            },
            {
              char: '喝',
              pinyin: 'hē',
              meaning: '喝水；喝茶；喝彩',
              meaningEn: 'to drink',
              example: '喝水',
              examplePinyin: 'hē shuǐ',
              exampleMeaning: 'to drink water',
              examples: ["喝水","喝茶","喝汤"]
            },
            {
              char: '坑',
              pinyin: 'kēng',
              meaning: '泥坑；坑洼；水坑',
              meaningEn: 'pit; hole; hollow',
              example: '水坑',
              examplePinyin: 'shuǐ kēng',
              exampleMeaning: 'puddle; water pit',
              examples: ["水坑","泥坑","坑洼"]
            },
            {
              char: '挺',
              pinyin: 'tǐng',
              meaning: '挺好；挺立；笔挺',
              meaningEn: 'quite; very; to stand upright; straight',
              example: '挺好',
              examplePinyin: 'tǐng hǎo',
              exampleMeaning: 'quite good; pretty good',
              examples: ["挺好","挺立","笔挺"]
            },
            {
              char: '舒',
              pinyin: 'shū',
              meaning: '舒服；舒适；舒展',
              meaningEn: 'comfortable; at ease; to stretch',
              example: '舒服',
              examplePinyin: 'shū fu',
              exampleMeaning: 'comfortable; feeling good',
              examples: ["舒服","舒适","舒展"]
            },
            {
              char: '集',
              pinyin: 'jí',
              meaning: '集市；集合；收集',
              meaningEn: 'to gather; market; collection',
              example: '集市',
              examplePinyin: 'jí shì',
              exampleMeaning: 'market; bazaar; fair',
              examples: ["集市","集合","收集"]
            },
            {
              char: '播',
              pinyin: 'bō',
              meaning: '播种；广播；播放',
              meaningEn: 'to sow; to broadcast; to spread',
              example: '播种',
              examplePinyin: 'bō zhǒng',
              exampleMeaning: 'to sow seeds; to plant',
              examples: ["播种","广播","播放"]
            },
            {
              char: '撒',
              pinyin: 'sā',
              meaning: '撒种；撒网；撒花',
              meaningEn: 'to scatter; to sprinkle; to cast',
              example: '撒种',
              examplePinyin: 'sā zhǒng',
              exampleMeaning: 'to scatter seeds; to sow',
              examples: ["撒种","撒网","撒花"]
            },
            {
              char: '茵',
              pinyin: 'yīn',
              meaning: '绿茵茵；草茵；芳茵',
              meaningEn: 'lush grass; soft grass; lawn',
              example: '绿茵茵',
              examplePinyin: 'lǜ yīn yīn',
              exampleMeaning: 'lush green; verdant',
              examples: ["绿茵茵","草茵","绿茵"]
            },
            {
              char: '灌',
              pinyin: 'guàn',
              meaning: '灌溉；灌水；灌木',
              meaningEn: 'to irrigate; to pour into; to fill',
              example: '灌溉',
              examplePinyin: 'guàn gài',
              exampleMeaning: 'to irrigate; irrigation',
              examples: ["灌溉","灌水","灌木"]
            },
            {
              char: '缺',
              pinyin: 'quē',
              meaning: '缺少；缺乏；缺点',
              meaningEn: 'to lack; shortage; deficiency',
              example: '缺少',
              examplePinyin: 'quē shǎo',
              exampleMeaning: 'to lack; to be short of',
              examples: ["缺少","缺乏","缺点"]
            },
            {
              char: '泳',
              pinyin: 'yǒng',
              meaning: '游泳；泳池；泳衣',
              meaningEn: 'to swim; swimming',
              example: '游泳',
              examplePinyin: 'yóu yǒng',
              exampleMeaning: 'to swim; swimming',
              examples: ["游泳","泳池","泳衣"]
            },
            {
              char: '愣',
              pinyin: 'lèng',
              meaning: '发愣；愣住；愣了一下',
              meaningEn: 'to be dazed; to be stupefied; stunned',
              example: '发愣',
              examplePinyin: 'fā lèng',
              exampleMeaning: 'to be in a daze; to stare blankly',
              examples: ["发愣","愣住","愣了一下"]
            },
            {
              char: '蛙',
              pinyin: 'wā',
              meaning: '青蛙；蛙泳；牛蛙',
              meaningEn: 'frog',
              example: '青蛙',
              examplePinyin: 'qīng wā',
              exampleMeaning: 'frog',
              examples: ["青蛙","蛙泳","牛蛙"]
            },
            {
              char: '搬',
              pinyin: 'bān',
              meaning: '搬家；搬运；搬走',
              meaningEn: 'to move; to carry; to relocate',
              example: '搬家',
              examplePinyin: 'bān jiā',
              exampleMeaning: 'to move house; to relocate',
              examples: ["搬家","搬运","搬走"]
            },
            {
              char: '籽',
              pinyin: 'zǐ',
              meaning: '种籽；籽粒；草籽',
              meaningEn: 'seed; grain',
              example: '种籽',
              examplePinyin: 'zhǒng zǐ',
              exampleMeaning: 'seed',
              examples: ["种籽","草籽","籽粒"]
            },
            {
              char: '破',
              pinyin: 'pò',
              meaning: '破旧；打破；破坏',
              meaningEn: 'broken; worn out; to break; to damage',
              example: '破旧',
              examplePinyin: 'pò jiù',
              exampleMeaning: 'worn out; dilapidated',
              examples: ["破旧","打破","破坏"]
            },
            {
              char: '倒',
              pinyin: 'dào',
              meaning: '倒下；倒塌；倒入',
              meaningEn: 'to fall; to pour; upside down',
              example: '倒下',
              examplePinyin: 'dào xià',
              exampleMeaning: 'to fall down; to topple',
              examples: ["倒下","倒塌","倒入"]
            },
            {
              char: '泉',
              pinyin: 'quán',
              meaning: '泉水；温泉；泉眼',
              meaningEn: 'spring; fountain; spring water',
              example: '泉水',
              examplePinyin: 'quán shuǐ',
              exampleMeaning: 'spring water',
              examples: ["泉水","温泉","泉眼"]
            },
            {
              char: '应',
              pinyin: 'yīng',
              meaning: '应该；应当；应有',
              meaningEn: 'should; ought to; must',
              example: '应该',
              examplePinyin: 'yīng gāi',
              exampleMeaning: 'should; ought to',
              examples: ["应该","应当","应有"]
            },
          ]
        },
        {
          number: 22,
          unit: 7,
          title: '小毛虫',
          words: [
            {
              char: '昆',
              pinyin: 'kūn',
              meaning: '昆虫；昆明；昆仑',
              meaningEn: 'insect; (part of 昆虫)',
              example: '昆虫',
              examplePinyin: 'kūn chóng',
              exampleMeaning: 'insect; bug',
              examples: ["昆虫","昆明","昆仑山"]
            },
            {
              char: '怜',
              pinyin: 'lián',
              meaning: '怜悯；可怜；同情',
              meaningEn: 'to pity; to feel sorry for; compassion',
              example: '可怜',
              examplePinyin: 'kě lián',
              exampleMeaning: 'pitiful; poor thing',
              examples: ["可怜","怜悯","怜惜"]
            },
            {
              char: '挪',
              pinyin: 'nuó',
              meaning: '挪动；挪步；挪移',
              meaningEn: 'to move; to shift; to budge',
              example: '挪动',
              examplePinyin: 'nuó dòng',
              exampleMeaning: 'to move; to shift position',
              examples: ["挪动","挪步","挪移"]
            },
            {
              char: '仿',
              pinyin: 'fǎng',
              meaning: '仿佛；模仿；仿照',
              meaningEn: 'to imitate; to seem; as if',
              example: '仿佛',
              examplePinyin: 'fǎng fú',
              exampleMeaning: 'as if; seemingly; to seem like',
              examples: ["仿佛","模仿","仿照"]
            },
            {
              char: '佛',
              pinyin: 'fú',
              meaning: '仿佛；佛像；佛教',
              meaningEn: 'Buddha; (in 仿佛: as if)',
              example: '仿佛',
              examplePinyin: 'fǎng fú',
              exampleMeaning: 'as if; seemingly',
              examples: ["仿佛","佛像","佛教"]
            },
            {
              char: '尽',
              pinyin: 'jǐn',
              meaning: '尽管；尽力；尽量',
              meaningEn: 'to the best of; as much as possible (pronunciation: jǐn)',
              example: '尽管',
              examplePinyin: 'jǐn guǎn',
              exampleMeaning: 'even though; despite; feel free to',
              examples: ["尽管","尽力","尽量"]
            },
            {
              char: '任',
              pinyin: 'rèn',
              meaning: '任何；任务；担任',
              meaningEn: 'any; to assign; duty; to hold a post',
              example: '任何',
              examplePinyin: 'rèn hé',
              exampleMeaning: 'any; whatever; whichever',
              examples: ["任何","任务","担任"]
            },
            {
              char: '何',
              pinyin: 'hé',
              meaning: '任何；为何；如何',
              meaningEn: 'what; how; why; any',
              example: '如何',
              examplePinyin: 'rú hé',
              exampleMeaning: 'how; in what way',
              examples: ["如何","任何","为何"]
            },
            {
              char: '纺',
              pinyin: 'fǎng',
              meaning: '纺纱；纺织；纺线',
              meaningEn: 'to spin (thread); spinning; textile',
              example: '纺纱',
              examplePinyin: 'fǎng shā',
              exampleMeaning: 'to spin yarn/thread',
              examples: ["纺纱","纺织","纺线"]
            },
            {
              char: '竭',
              pinyin: 'jié',
              meaning: '竭力；竭尽；精疲力竭',
              meaningEn: 'to exhaust; to use up; with all one\'s might',
              example: '竭力',
              examplePinyin: 'jié lì',
              exampleMeaning: 'to do one\'s utmost; with all effort',
              examples: ["竭力","竭尽","精疲力竭"]
            },
            {
              char: '规',
              pinyin: 'guī',
              meaning: '规律；规则；规定',
              meaningEn: 'rule; regulation; pattern; law',
              example: '规律',
              examplePinyin: 'guī lǜ',
              exampleMeaning: 'law; rule; pattern; regularity',
              examples: ["规律","规则","规定"]
            },
            {
              char: '律',
              pinyin: 'lǜ',
              meaning: '规律；纪律；法律',
              meaningEn: 'law; rule; discipline; rhythm',
              example: '纪律',
              examplePinyin: 'jì lǜ',
              exampleMeaning: 'discipline; rules',
              examples: ["纪律","规律","法律"]
            },
            {
              char: '待',
              pinyin: 'dài',
              meaning: '等待；待命；期待',
              meaningEn: 'to wait; to treat; to stay',
              example: '等待',
              examplePinyin: 'děng dài',
              exampleMeaning: 'to wait; to await',
              examples: ["等待","期待","待命"]
            },
            {
              char: '挣',
              pinyin: 'zhèng',
              meaning: '挣脱；挣扎；挣开',
              meaningEn: 'to struggle free; to break loose; to wriggle out',
              example: '挣脱',
              examplePinyin: 'zhèng tuō',
              exampleMeaning: 'to break free; to struggle loose',
              examples: ["挣脱","挣扎","挣开"]
            },
            {
              char: '愉',
              pinyin: 'yú',
              meaning: '愉快；愉悦；欢愉',
              meaningEn: 'happy; joyful; cheerful',
              example: '愉快',
              examplePinyin: 'yú kuài',
              exampleMeaning: 'happy; joyful; pleasant',
              examples: ["愉快","愉悦","欢愉"]
            },
            {
              char: '绒',
              pinyin: 'róng',
              meaning: '绒毛；绒布；天鹅绒',
              meaningEn: 'down; velvet; fluff; soft fiber',
              example: '绒毛',
              examplePinyin: 'róng máo',
              exampleMeaning: 'down; fluff; soft hair',
              examples: ["绒毛","绒布","天鹅绒"]
            },
            {
              char: '整',
              pinyin: 'zhěng',
              meaning: '整理；整齐；完整',
              meaningEn: 'to organize; tidy; whole; complete',
              example: '整理',
              examplePinyin: 'zhěng lǐ',
              exampleMeaning: 'to tidy up; to sort out',
              examples: ["整理","整齐","完整"]
            },
            {
              char: '编',
              pinyin: 'biān',
              meaning: '编织；编写；编排',
              meaningEn: 'to weave; to knit; to compile',
              example: '编织',
              examplePinyin: 'biān zhī',
              exampleMeaning: 'to weave; to knit',
              examples: ["编织","编写","编排"]
            },
            {
              char: '布',
              pinyin: 'bù',
              meaning: '布料；棉布；宣布',
              meaningEn: 'cloth; fabric; to announce; to spread',
              example: '布料',
              examplePinyin: 'bù liào',
              exampleMeaning: 'cloth; fabric; material',
              examples: ["布料","棉布","宣布"]
            },
            {
              char: '抽',
              pinyin: 'chōu',
              meaning: '抽出；抽丝；抽空',
              meaningEn: 'to pull out; to draw; to extract',
              example: '抽丝',
              examplePinyin: 'chōu sī',
              exampleMeaning: 'to reel silk; to draw out thread',
              examples: ["抽丝","抽出","抽空"]
            },
            {
              char: '织',
              pinyin: 'zhī',
              meaning: '编织；织布；织网',
              meaningEn: 'to weave; to knit; to spin',
              example: '编织',
              examplePinyin: 'biān zhī',
              exampleMeaning: 'to weave; to knit',
              examples: ["编织","织布","织网"]
            },
            {
              char: '怎',
              pinyin: 'zěn',
              meaning: '怎么；怎样；怎么了',
              meaningEn: 'how; why; what',
              example: '怎么',
              examplePinyin: 'zěn me',
              exampleMeaning: 'how; why; what',
              examples: ["怎么","怎样","怎么了"]
            },
            {
              char: '消',
              pinyin: 'xiāo',
              meaning: '消失；消化；取消',
              meaningEn: 'to disappear; to digest; to cancel',
              example: '消失',
              examplePinyin: 'xiāo shī',
              exampleMeaning: 'to disappear; to vanish',
              examples: ["消失","消化","取消"]
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
