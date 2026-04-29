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
            {
              char: '莺',
              pinyin: 'yīng',
              meaning: '黄莺；莺歌；鸣莺',
              meaningEn: 'oriole; warbler',
              example: '黄莺',
              examplePinyin: 'huáng yīng',
              exampleMeaning: 'oriole; yellow warbler',
              examples: ["黄莺","莺歌","莺鸣"]
            },
            {
              char: '拂',
              pinyin: 'fú',
              meaning: '拂晓；轻拂；拂过',
              meaningEn: 'to brush lightly; to stroke; dawn',
              example: '拂晓',
              examplePinyin: 'fú xiǎo',
              exampleMeaning: 'dawn; daybreak',
              examples: ["拂晓","轻拂","拂过"]
            },
            {
              char: '堤',
              pinyin: 'dī',
              meaning: '堤岸；河堤；堤坝',
              meaningEn: 'embankment; dike; levee',
              example: '河堤',
              examplePinyin: 'hé dī',
              exampleMeaning: 'river embankment; levee',
              examples: ["河堤","堤岸","堤坝"]
            },
            {
              char: '柳',
              pinyin: 'liǔ',
              meaning: '柳树；垂柳；柳枝',
              meaningEn: 'willow tree',
              example: '垂柳',
              examplePinyin: 'chuí liǔ',
              exampleMeaning: 'weeping willow',
              examples: ["垂柳","柳树","柳枝"]
            },
            {
              char: '醉',
              pinyin: 'zuì',
              meaning: '陶醉；沉醉；醉人',
              meaningEn: 'drunk; intoxicated; enchanted',
              example: '陶醉',
              examplePinyin: 'táo zuì',
              exampleMeaning: 'to be enchanted; to be intoxicated (by beauty)',
              examples: ["陶醉","沉醉","醉人"]
            },
            {
              char: '咏',
              pinyin: 'yǒng',
              meaning: '吟咏；咏唱；歌咏',
              meaningEn: 'to chant; to recite (poetry); to sing',
              example: '吟咏',
              examplePinyin: 'yín yǒng',
              exampleMeaning: 'to chant; to recite poetry',
              examples: ["吟咏","咏唱","歌咏"]
            },
            {
              char: '绦',
              pinyin: 'tāo',
              meaning: '绦带；丝绦；绿丝绦',
              meaningEn: 'silk ribbon; silk cord; braid',
              example: '绿丝绦',
              examplePinyin: 'lǜ sī tāo',
              exampleMeaning: 'green silk ribbons (refers to willow branches)',
              examples: ["绿丝绦","丝绦","绦带"]
            },
            {
              char: '裁',
              pinyin: 'cái',
              meaning: '裁剪；裁缝；裁判',
              meaningEn: 'to cut; to tailor; to judge',
              example: '裁剪',
              examplePinyin: 'cái jiǎn',
              exampleMeaning: 'to cut; to trim (fabric)',
              examples: ["裁剪","裁缝","裁判"]
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
            {
              char: '脱',
              pinyin: 'tuō',
              meaning: '脱衣；脱落；脱口',
              meaningEn: 'to take off; to shed; to escape',
              example: '脱衣',
              examplePinyin: 'tuō yī',
              exampleMeaning: 'to take off clothes',
              examples: ["脱衣","脱落","脱口而出"]
            },
            {
              char: '袄',
              pinyin: 'ǎo',
              meaning: '棉袄；皮袄；小棉袄',
              meaningEn: 'cotton-padded jacket; padded coat',
              example: '棉袄',
              examplePinyin: 'mián ǎo',
              exampleMeaning: 'cotton-padded jacket',
              examples: ["棉袄","皮袄","小棉袄"]
            },
            {
              char: '羞',
              pinyin: 'xiū',
              meaning: '害羞；羞耻；羞怯',
              meaningEn: 'shy; ashamed; bashful',
              example: '害羞',
              examplePinyin: 'hài xiū',
              exampleMeaning: 'shy; bashful',
              examples: ["害羞","羞耻","羞怯"]
            },
            {
              char: '遮',
              pinyin: 'zhē',
              meaning: '遮住；遮挡；遮盖',
              meaningEn: 'to cover; to hide; to block',
              example: '遮住',
              examplePinyin: 'zhē zhù',
              exampleMeaning: 'to cover up; to block',
              examples: ["遮住","遮挡","遮盖"]
            },
            {
              char: '掩',
              pinyin: 'yǎn',
              meaning: '掩盖；掩护；掩藏',
              meaningEn: 'to cover; to conceal; to shelter',
              example: '掩盖',
              examplePinyin: 'yǎn gài',
              exampleMeaning: 'to cover up; to conceal',
              examples: ["掩盖","掩护","掩藏"]
            },
            {
              char: '探',
              pinyin: 'tàn',
              meaning: '探出；探索；探望',
              meaningEn: 'to stretch out; to probe; to explore; to visit',
              example: '探出',
              examplePinyin: 'tàn chū',
              exampleMeaning: 'to stretch out; to peek out',
              examples: ["探出","探索","探望"]
            },
            {
              char: '嫩',
              pinyin: 'nèn',
              meaning: '嫩芽；嫩绿；嫩草',
              meaningEn: 'tender; delicate; young (shoots)',
              example: '嫩芽',
              examplePinyin: 'nèn yá',
              exampleMeaning: 'tender bud; young shoot',
              examples: ["嫩芽","嫩绿","嫩草"]
            },
            {
              char: '符',
              pinyin: 'fú',
              meaning: '音符；符号；符合',
              meaningEn: 'symbol; note (music); to accord with',
              example: '音符',
              examplePinyin: 'yīn fú',
              exampleMeaning: 'musical note',
              examples: ["音符","符号","符合"]
            },
            {
              char: '解',
              pinyin: 'jiě',
              meaning: '理解；解开；解答',
              meaningEn: 'to understand; to untie; to solve',
              example: '理解',
              examplePinyin: 'lǐ jiě',
              exampleMeaning: 'to understand; comprehension',
              examples: ["理解","解开","解答"]
            },
            {
              char: '触',
              pinyin: 'chù',
              meaning: '触摸；触碰；感触',
              meaningEn: 'to touch; to come in contact with',
              example: '触摸',
              examplePinyin: 'chù mō',
              exampleMeaning: 'to touch; to feel',
              examples: ["触摸","触碰","感触"]
            },
            {
              char: '杜',
              pinyin: 'dù',
              meaning: '杜鹃；杜绝；杜甫',
              meaningEn: 'azalea/cuckoo (in 杜鹃); surname Du',
              example: '杜鹃',
              examplePinyin: 'dù juān',
              exampleMeaning: 'azalea (flower) or cuckoo (bird)',
              examples: ["杜鹃","杜绝","杜甫"]
            },
            {
              char: '鹃',
              pinyin: 'juān',
              meaning: '杜鹃；杜鹃花；杜鹃鸟',
              meaningEn: 'cuckoo; azalea (second character of 杜鹃)',
              example: '杜鹃',
              examplePinyin: 'dù juān',
              exampleMeaning: 'azalea (flower) or cuckoo (bird)',
              examples: ["杜鹃","杜鹃花","杜鹃鸟"]
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
            {
              char: '裹',
              pinyin: 'guǒ',
              meaning: '包裹；裹紧；裹住',
              meaningEn: 'to wrap; to bundle; package',
              example: '包裹',
              examplePinyin: 'bāo guǒ',
              exampleMeaning: 'package; parcel',
              examples: ["包裹","裹紧","裹住"]
            },
            {
              char: '寄',
              pinyin: 'jì',
              meaning: '寄信；寄包裹；邮寄',
              meaningEn: 'to mail; to send; to entrust',
              example: '邮寄',
              examplePinyin: 'yóu jì',
              exampleMeaning: 'to mail; to send by post',
              examples: ["邮寄","寄信","寄包裹"]
            },
            {
              char: '破',
              pinyin: 'pò',
              meaning: '破了；破损；破裂',
              meaningEn: 'broken; damaged; torn',
              example: '破损',
              examplePinyin: 'pò sǔn',
              exampleMeaning: 'damaged; broken',
              examples: ["破损","破裂","破了"]
            },
            {
              char: '漏',
              pinyin: 'lòu',
              meaning: '漏出；泄漏；漏洞',
              meaningEn: 'to leak; to drip; to omit',
              example: '漏出',
              examplePinyin: 'lòu chū',
              exampleMeaning: 'to leak out; to spill out',
              examples: ["漏出","泄漏","漏洞"]
            },
            {
              char: '懊',
              pinyin: 'ào',
              meaning: '懊恼；懊悔；懊丧',
              meaningEn: 'vexed; regretful; annoyed',
              example: '懊恼',
              examplePinyin: 'ào nǎo',
              exampleMeaning: 'vexed; annoyed; upset',
              examples: ["懊恼","懊悔","懊丧"]
            },
            {
              char: '丧',
              pinyin: 'sàng',
              meaning: '懊丧；丧气；沮丧',
              meaningEn: 'dejected; dispirited; sad',
              example: '沮丧',
              examplePinyin: 'jǔ sàng',
              exampleMeaning: 'dejected; dispirited; discouraged',
              examples: ["沮丧","懊丧","丧气"]
            },
            {
              char: '啊',
              pinyin: 'ā',
              meaning: '啊！表示感叹；啊呀',
              meaningEn: 'ah! oh! (exclamation)',
              example: '啊！',
              examplePinyin: 'ā',
              exampleMeaning: 'ah! (exclamation of surprise or wonder)',
              examples: ["啊，真美","啊！","多美啊"]
            },
            {
              char: '刺',
              pinyin: 'cì',
              meaning: '刺猬；刺绣；刺破',
              meaningEn: 'thorn; to prick; to stab',
              example: '刺猬',
              examplePinyin: 'cì wei',
              exampleMeaning: 'hedgehog',
              examples: ["刺猬","刺绣","刺破"]
            },
            {
              char: '绚',
              pinyin: 'xuàn',
              meaning: '绚丽；绚烂；绚彩',
              meaningEn: 'gorgeous; brilliant; colorful',
              example: '绚丽',
              examplePinyin: 'xuàn lì',
              exampleMeaning: 'gorgeous; magnificent; brilliant',
              examples: ["绚丽","绚烂","绚彩"]
            },
            {
              char: '籽',
              pinyin: 'zǐ',
              meaning: '种籽；花籽；草籽',
              meaningEn: 'seed; grain',
              example: '花籽',
              examplePinyin: 'huā zǐ',
              exampleMeaning: 'flower seeds',
              examples: ["花籽","种籽","草籽"]
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
            {
              char: '坛',
              pinyin: 'tán',
              meaning: '花坛；坛子；讲坛',
              meaningEn: 'altar; platform; jar; flower bed',
              example: '花坛',
              examplePinyin: 'huā tán',
              exampleMeaning: 'flower bed; flowerbed',
              examples: ["花坛","坛子","讲坛"]
            },
            {
              char: '龄',
              pinyin: 'líng',
              meaning: '年龄；树龄；学龄',
              meaningEn: 'age; years',
              example: '年龄',
              examplePinyin: 'nián líng',
              exampleMeaning: 'age',
              examples: ["年龄","树龄","学龄"]
            },
            {
              char: '握',
              pinyin: 'wò',
              meaning: '握手；握住；把握',
              meaningEn: 'to grasp; to hold; to shake hands',
              example: '握手',
              examplePinyin: 'wò shǒu',
              exampleMeaning: 'to shake hands',
              examples: ["握手","握住","把握"]
            },
            {
              char: '致',
              pinyin: 'zhì',
              meaning: '导致；一致；致敬',
              meaningEn: 'to cause; to send; consistent; to pay tribute',
              example: '导致',
              examplePinyin: 'dǎo zhì',
              exampleMeaning: 'to lead to; to cause',
              examples: ["导致","一致","致敬"]
            },
            {
              char: '勃',
              pinyin: 'bó',
              meaning: '蓬勃；勃勃生机；勃然',
              meaningEn: 'vigorous; thriving; suddenly',
              example: '蓬勃',
              examplePinyin: 'péng bó',
              exampleMeaning: 'vigorous; flourishing; full of vitality',
              examples: ["蓬勃","勃勃生机","勃然大怒"]
            },
            {
              char: '挖',
              pinyin: 'wā',
              meaning: '挖土；挖掘；挖坑',
              meaningEn: 'to dig; to excavate',
              example: '挖土',
              examplePinyin: 'wā tǔ',
              exampleMeaning: 'to dig soil',
              examples: ["挖土","挖掘","挖坑"]
            },
            {
              char: '选',
              pinyin: 'xuǎn',
              meaning: '选择；选手；挑选',
              meaningEn: 'to choose; to select; to elect',
              example: '选择',
              examplePinyin: 'xuǎn zé',
              exampleMeaning: 'to choose; to select; choice',
              examples: ["选择","选手","挑选"]
            },
            {
              char: '茁',
              pinyin: 'zhuó',
              meaning: '茁壮；茁壮成长',
              meaningEn: 'sturdy; robust; growing vigorously',
              example: '茁壮',
              examplePinyin: 'zhuó zhuàng',
              exampleMeaning: 'sturdy; strong; growing vigorously',
              examples: ["茁壮","茁壮成长","茁然"]
            },
            {
              char: '移',
              pinyin: 'yí',
              meaning: '移动；移植；移开',
              meaningEn: 'to move; to shift; to transplant',
              example: '移动',
              examplePinyin: 'yí dòng',
              exampleMeaning: 'to move; to shift',
              examples: ["移动","移植","移开"]
            },
            {
              char: '挥',
              pinyin: 'huī',
              meaning: '挥手；挥舞；挥洒',
              meaningEn: 'to wave; to wield; to brandish',
              example: '挥手',
              examplePinyin: 'huī shǒu',
              exampleMeaning: 'to wave one\'s hand',
              examples: ["挥手","挥舞","发挥"]
            },
            {
              char: '填',
              pinyin: 'tián',
              meaning: '填土；填写；填满',
              meaningEn: 'to fill; to stuff; to complete (a form)',
              example: '填土',
              examplePinyin: 'tián tǔ',
              exampleMeaning: 'to fill with soil',
              examples: ["填土","填写","填满"]
            },
            {
              char: '扶',
              pinyin: 'fú',
              meaning: '扶树；扶起；搀扶',
              meaningEn: 'to support; to help up; to steady',
              example: '搀扶',
              examplePinyin: 'chān fú',
              exampleMeaning: 'to support; to help someone walk',
              examples: ["搀扶","扶起","扶树"]
            },
          ]
        },
        {
          number: 0,
          unit: 1,
          title: '语文园地一',
          words: [
            {
              char: '亭',
              pinyin: 'tíng',
              meaning: '亭子；凉亭；书亭',
              meaningEn: 'pavilion; kiosk; booth',
              example: '亭子',
              examplePinyin: 'tíng zi',
              exampleMeaning: 'pavilion; gazebo',
              examples: ["亭子","凉亭","书亭"]
            },
            {
              char: '咨',
              pinyin: 'zī',
              meaning: '咨询；咨问；咨商',
              meaningEn: 'to consult; to seek advice',
              example: '咨询',
              examplePinyin: 'zī xún',
              exampleMeaning: 'to consult; to seek advice; consultation',
              examples: ["咨询","咨问","咨询台"]
            },
            {
              char: '询',
              pinyin: 'xún',
              meaning: '询问；咨询；查询',
              meaningEn: 'to inquire; to ask; to consult',
              example: '询问',
              examplePinyin: 'xún wèn',
              exampleMeaning: 'to inquire; to ask',
              examples: ["询问","咨询","查询"]
            },
            {
              char: '剧',
              pinyin: 'jù',
              meaning: '剧场；电视剧；戏剧',
              meaningEn: 'drama; theater; play; intense',
              example: '剧场',
              examplePinyin: 'jù chǎng',
              exampleMeaning: 'theater; playhouse',
              examples: ["剧场","电视剧","戏剧"]
            },
            {
              char: '管',
              pinyin: 'guǎn',
              meaning: '管理；管道；笔管',
              meaningEn: 'to manage; pipe; tube; in charge of',
              example: '管理',
              examplePinyin: 'guǎn lǐ',
              exampleMeaning: 'to manage; management',
              examples: ["管理","管道","不管"]
            },
            {
              char: '理',
              pinyin: 'lǐ',
              meaning: '管理；理解；道理',
              meaningEn: 'to manage; reason; logic; to tidy',
              example: '道理',
              examplePinyin: 'dào li',
              exampleMeaning: 'reason; logic; sense',
              examples: ["道理","管理","理解"]
            },
            {
              char: '宝',
              pinyin: 'bǎo',
              meaning: '宝贝；珍宝；宝塔',
              meaningEn: 'treasure; precious; baby (term of endearment)',
              example: '宝贝',
              examplePinyin: 'bǎo bèi',
              exampleMeaning: 'treasure; baby; darling',
              examples: ["宝贝","珍宝","宝塔"]
            },
            {
              char: '塔',
              pinyin: 'tǎ',
              meaning: '宝塔；灯塔；塔楼',
              meaningEn: 'tower; pagoda; stupa',
              example: '宝塔',
              examplePinyin: 'bǎo tǎ',
              exampleMeaning: 'pagoda; treasure tower',
              examples: ["宝塔","灯塔","塔楼"]
            },
            {
              char: '餐',
              pinyin: 'cān',
              meaning: '餐厅；餐饮；早餐',
              meaningEn: 'meal; to eat; restaurant',
              example: '餐厅',
              examplePinyin: 'cān tīng',
              exampleMeaning: 'restaurant; dining hall',
              examples: ["餐厅","早餐","餐饮"]
            },
            {
              char: '厅',
              pinyin: 'tīng',
              meaning: '餐厅；大厅；听众厅',
              meaningEn: 'hall; living room; dining room',
              example: '大厅',
              examplePinyin: 'dà tīng',
              exampleMeaning: 'hall; lobby; foyer',
              examples: ["大厅","餐厅","客厅"]
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
            {
              char: '曾',
              pinyin: 'céng',
              meaning: '曾经；未曾；曾几何时',
              meaningEn: 'once; ever; formerly',
              example: '曾经',
              examplePinyin: 'céng jīng',
              exampleMeaning: 'once; used to; formerly',
              examples: ["曾经","未曾","曾经来过"]
            },
            {
              char: '蒙',
              pinyin: 'méng',
              meaning: '蒙蒙细雨；蒙住；蒙昧',
              meaningEn: 'drizzle; to cover; to deceive; dim',
              example: '蒙蒙细雨',
              examplePinyin: 'méng méng xì yǔ',
              exampleMeaning: 'light drizzle; misty rain',
              examples: ["蒙蒙细雨","蒙住","启蒙"]
            },
            {
              char: '泞',
              pinyin: 'nìng',
              meaning: '泥泞；泞路；泞滑',
              meaningEn: 'muddy; boggy; miry',
              example: '泥泞',
              examplePinyin: 'ní nìng',
              exampleMeaning: 'muddy; miry; boggy',
              examples: ["泥泞","泞路","泥泞小路"]
            },
            {
              char: '顺',
              pinyin: 'shùn',
              meaning: '顺着；顺利；顺序',
              meaningEn: 'along; smooth; in order; to obey',
              example: '顺利',
              examplePinyin: 'shùn lì',
              exampleMeaning: 'smooth; without a hitch',
              examples: ["顺利","顺着","顺序"]
            },
            {
              char: '迈',
              pinyin: 'mài',
              meaning: '迈步；迈开；跨迈',
              meaningEn: 'to step; to stride; to march',
              example: '迈步',
              examplePinyin: 'mài bù',
              exampleMeaning: 'to take a step; to stride forward',
              examples: ["迈步","迈开","大步迈进"]
            },
            {
              char: '踏',
              pinyin: 'tà',
              meaning: '踏着；踏上；踩踏',
              meaningEn: 'to step on; to tread; to trample',
              example: '踏上',
              examplePinyin: 'tà shàng',
              exampleMeaning: 'to step onto; to set foot on',
              examples: ["踏上","踏着","踩踏"]
            },
            {
              char: '荆',
              pinyin: 'jīng',
              meaning: '荆棘；荆条；披荆斩棘',
              meaningEn: 'thorny shrub; (in 荆棘: thorns and brambles)',
              example: '荆棘',
              examplePinyin: 'jīng jí',
              exampleMeaning: 'thorns and brambles; obstacles',
              examples: ["荆棘","披荆斩棘","荆条"]
            },
            {
              char: '棘',
              pinyin: 'jí',
              meaning: '荆棘；棘手；棘刺',
              meaningEn: 'thorn; prickle; thorny',
              example: '荆棘',
              examplePinyin: 'jīng jí',
              exampleMeaning: 'thorns and brambles; obstacles',
              examples: ["荆棘","棘手","棘刺"]
            },
            {
              char: '瓣',
              pinyin: 'bàn',
              meaning: '花瓣；蒜瓣；瓣膜',
              meaningEn: 'petal; segment; clove; valve',
              example: '花瓣',
              examplePinyin: 'huā bàn',
              exampleMeaning: 'petal',
              examples: ["花瓣","蒜瓣","花瓣飘落"]
            },
            {
              char: '莹',
              pinyin: 'yíng',
              meaning: '晶莹；莹白；莹洁',
              meaningEn: 'lustrous; sparkling; translucent',
              example: '晶莹',
              examplePinyin: 'jīng yíng',
              exampleMeaning: 'sparkling; glistening; crystal clear',
              examples: ["晶莹","莹白","晶莹剔透"]
            },
            {
              char: '觅',
              pinyin: 'mì',
              meaning: '寻觅；觅食；觅路',
              meaningEn: 'to seek; to search for; to look for',
              example: '寻觅',
              examplePinyin: 'xún mì',
              exampleMeaning: 'to seek; to search for',
              examples: ["寻觅","觅食","觅路"]
            },
            {
              char: '需',
              pinyin: 'xū',
              meaning: '需要；需求；必需',
              meaningEn: 'to need; to require; demand',
              example: '需要',
              examplePinyin: 'xū yào',
              exampleMeaning: 'to need; to require; need',
              examples: ["需要","需求","必需"]
            },
            {
              char: '献',
              pinyin: 'xiàn',
              meaning: '献出；奉献；献花',
              meaningEn: 'to offer; to dedicate; to contribute',
              example: '奉献',
              examplePinyin: 'fèng xiàn',
              exampleMeaning: 'to dedicate; to devote; contribution',
              examples: ["奉献","献出","献花"]
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
            {
              char: '糕',
              pinyin: 'gāo',
              meaning: '糕点；蛋糕；千人糕',
              meaningEn: 'cake; pastry',
              example: '蛋糕',
              examplePinyin: 'dàn gāo',
              exampleMeaning: 'cake',
              examples: ["蛋糕","糕点","年糕"]
            },
            {
              char: '特',
              pinyin: 'tè',
              meaning: '特别；特殊；特点',
              meaningEn: 'special; particular; unique',
              example: '特别',
              examplePinyin: 'tè bié',
              exampleMeaning: 'special; especially',
              examples: ["特别","特殊","特点"]
            },
            {
              char: '嘛',
              pinyin: 'ma',
              meaning: '嘛！表示语气；当然嘛',
              meaningEn: 'particle expressing obviousness or mild assertion',
              example: '当然嘛',
              examplePinyin: 'dāng rán ma',
              exampleMeaning: 'of course! naturally!',
              examples: ["当然嘛","是嘛","好嘛"]
            },
            {
              char: '粉',
              pinyin: 'fěn',
              meaning: '米粉；粉末；面粉',
              meaningEn: 'powder; flour; noodles',
              example: '面粉',
              examplePinyin: 'miàn fěn',
              exampleMeaning: 'wheat flour',
              examples: ["面粉","米粉","粉末"]
            },
            {
              char: '糖',
              pinyin: 'táng',
              meaning: '糖果；白糖；糖分',
              meaningEn: 'sugar; candy; sweets',
              example: '糖果',
              examplePinyin: 'táng guǒ',
              exampleMeaning: 'candy; sweets',
              examples: ["糖果","白糖","糖分"]
            },
            {
              char: '蔗',
              pinyin: 'zhè',
              meaning: '甘蔗；蔗糖；蔗汁',
              meaningEn: 'sugarcane',
              example: '甘蔗',
              examplePinyin: 'gān zhè',
              exampleMeaning: 'sugarcane',
              examples: ["甘蔗","蔗糖","蔗汁"]
            },
            {
              char: '汁',
              pinyin: 'zhī',
              meaning: '果汁；蔗汁；汁液',
              meaningEn: 'juice; liquid; sap',
              example: '果汁',
              examplePinyin: 'guǒ zhī',
              exampleMeaning: 'fruit juice',
              examples: ["果汁","蔗汁","汁液"]
            },
            {
              char: '熬',
              pinyin: 'áo',
              meaning: '熬糖；熬夜；熬煮',
              meaningEn: 'to boil; to simmer; to endure',
              example: '熬夜',
              examplePinyin: 'áo yè',
              exampleMeaning: 'to stay up late; to burn the midnight oil',
              examples: ["熬夜","熬糖","熬煮"]
            },
            {
              char: '算',
              pinyin: 'suàn',
              meaning: '算一算；计算；算法',
              meaningEn: 'to calculate; to count; to figure',
              example: '计算',
              examplePinyin: 'jì suàn',
              exampleMeaning: 'to calculate; to compute',
              examples: ["计算","算一算","算法"]
            },
            {
              char: '销',
              pinyin: 'xiāo',
              meaning: '销售；销路；畅销',
              meaningEn: 'to sell; to market; sales',
              example: '销售',
              examplePinyin: 'xiāo shòu',
              exampleMeaning: 'to sell; sales',
              examples: ["销售","销路","畅销"]
            },
            {
              char: '的',
              pinyin: 'dí',
              meaning: '的确；确实；真的',
              meaningEn: 'indeed; truly; really (pronunciation: dí in 的确)',
              example: '的确',
              examplePinyin: 'dí què',
              exampleMeaning: 'indeed; truly; certainly',
              examples: ["的确","的确如此","确实"]
            },
            {
              char: '确',
              pinyin: 'què',
              meaning: '的确；确实；确认',
              meaningEn: 'indeed; certain; to confirm',
              example: '确实',
              examplePinyin: 'què shí',
              exampleMeaning: 'indeed; truly; in fact',
              examples: ["确实","的确","确认"]
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
            {
              char: '郊',
              pinyin: 'jiāo',
              meaning: '郊外；郊区；城郊',
              meaningEn: 'suburbs; outskirts; countryside',
              example: '郊外',
              examplePinyin: 'jiāo wài',
              exampleMeaning: 'outskirts; countryside outside a city',
              examples: ["郊外","郊区","城郊"]
            },
            {
              char: '泛',
              pinyin: 'fàn',
              meaning: '泛舟；泛起；泛滥',
              meaningEn: 'to float; to ripple; to be suffused with',
              example: '泛舟',
              examplePinyin: 'fàn zhōu',
              exampleMeaning: 'to go boating; to sail',
              examples: ["泛舟","泛起","泛滥"]
            },
            {
              char: '葱',
              pinyin: 'cōng',
              meaning: '葱绿；葱茏；葱白',
              meaningEn: 'green onion; lush green; verdant',
              example: '葱绿',
              examplePinyin: 'cōng lǜ',
              exampleMeaning: 'lush green; verdant',
              examples: ["葱绿","葱茏","大葱"]
            },
            {
              char: '软',
              pinyin: 'ruǎn',
              meaning: '柔软；软绵绵；软化',
              meaningEn: 'soft; flexible; gentle',
              example: '柔软',
              examplePinyin: 'róu ruǎn',
              exampleMeaning: 'soft; flexible; pliable',
              examples: ["柔软","软绵绵","软化"]
            },
            {
              char: '毯',
              pinyin: 'tǎn',
              meaning: '绒毯；草毯；毛毯',
              meaningEn: 'blanket; carpet; rug',
              example: '毛毯',
              examplePinyin: 'máo tǎn',
              exampleMeaning: 'woolen blanket',
              examples: ["毛毯","绒毯","地毯"]
            },
            {
              char: '异',
              pinyin: 'yì',
              meaning: '异乡；奇异；异常',
              meaningEn: 'different; strange; foreign; unusual',
              example: '异乡',
              examplePinyin: 'yì xiāng',
              exampleMeaning: 'foreign land; place away from home',
              examples: ["异乡","奇异","异常"]
            },
            {
              char: '株',
              pinyin: 'zhū',
              meaning: '守株待兔；株连；一株树',
              meaningEn: 'tree trunk; (measure word for plants); to involve',
              example: '守株待兔',
              examplePinyin: 'shǒu zhū dài tù',
              exampleMeaning: 'to wait for gains without working (idiom)',
              examples: ["守株待兔","一株树","株连"]
            },
            {
              char: '拾',
              pinyin: 'shí',
              meaning: '拾起；捡拾；拾穗',
              meaningEn: 'to pick up; to collect; to tidy',
              example: '拾起',
              examplePinyin: 'shí qǐ',
              exampleMeaning: 'to pick up; to retrieve',
              examples: ["拾起","捡拾","拾穗"]
            },
            {
              char: '骑',
              pinyin: 'qí',
              meaning: '骑马；骑车；骑行',
              meaningEn: 'to ride (a horse, bike)',
              example: '骑马',
              examplePinyin: 'qí mǎ',
              exampleMeaning: 'to ride a horse',
              examples: ["骑马","骑车","骑行"]
            },
            {
              char: '跨',
              pinyin: 'kuà',
              meaning: '跨过；跨越；跨步',
              meaningEn: 'to stride over; to step across; to span',
              example: '跨过',
              examplePinyin: 'kuà guò',
              exampleMeaning: 'to step over; to cross',
              examples: ["跨过","跨越","跨步"]
            },
          ]
        },
        {
          number: 0,
          unit: 2,
          title: '语文园地二',
          words: [
            {
              char: '程',
              pinyin: 'chéng',
              meaning: '程序；工程；课程',
              meaningEn: 'process; procedure; course; journey',
              example: '程序',
              examplePinyin: 'chéng xù',
              exampleMeaning: 'procedure; process; program',
              examples: ["程序","工程","课程"]
            },
            {
              char: '魔',
              pinyin: 'mó',
              meaning: '魔术；魔法；魔力',
              meaningEn: 'magic; demon; supernatural',
              example: '魔术',
              examplePinyin: 'mó shù',
              exampleMeaning: 'magic; conjuring',
              examples: ["魔术","魔法","魔力"]
            },
            {
              char: '术',
              pinyin: 'shù',
              meaning: '魔术；技术；艺术',
              meaningEn: 'skill; art; technique; magic',
              example: '技术',
              examplePinyin: 'jì shù',
              exampleMeaning: 'technology; technique; skill',
              examples: ["技术","魔术","艺术"]
            },
            {
              char: '建',
              pinyin: 'jiàn',
              meaning: '建筑；建设；建立',
              meaningEn: 'to build; to establish; to construct',
              example: '建设',
              examplePinyin: 'jiàn shè',
              exampleMeaning: 'to build; to develop; construction',
              examples: ["建设","建筑","建立"]
            },
            {
              char: '筑',
              pinyin: 'zhù',
              meaning: '建筑；筑巢；筑路',
              meaningEn: 'to build; to construct; architecture',
              example: '建筑',
              examplePinyin: 'jiàn zhù',
              exampleMeaning: 'building; architecture; construction',
              examples: ["建筑","筑巢","筑路"]
            },
            {
              char: '演',
              pinyin: 'yǎn',
              meaning: '表演；演出；演员',
              meaningEn: 'to perform; to act; to演 演show',
              example: '表演',
              examplePinyin: 'biǎo yǎn',
              exampleMeaning: 'to perform; performance',
              examples: ["表演","演出","演员"]
            },
            {
              char: '营',
              pinyin: 'yíng',
              meaning: '营地；夏令营；营救',
              meaningEn: 'camp; to manage; to operate',
              example: '夏令营',
              examplePinyin: 'xià lìng yíng',
              exampleMeaning: 'summer camp',
              examples: ["夏令营","营地","营救"]
            },
            {
              char: '务',
              pinyin: 'wù',
              meaning: '任务；服务；务必',
              meaningEn: 'task; duty; service; must',
              example: '任务',
              examplePinyin: 'rèn wu',
              exampleMeaning: 'task; mission; assignment',
              examples: ["任务","服务","务必"]
            },
            {
              char: '判',
              pinyin: 'pàn',
              meaning: '判断；裁判；判决',
              meaningEn: 'to judge; to determine; verdict',
              example: '判断',
              examplePinyin: 'pàn duàn',
              exampleMeaning: 'to judge; to determine; judgement',
              examples: ["判断","裁判","判决"]
            },
            {
              char: '饲',
              pinyin: 'sì',
              meaning: '饲养；饲料；饲育',
              meaningEn: 'to feed (animals); to raise',
              example: '饲养',
              examplePinyin: 'sì yǎng',
              exampleMeaning: 'to raise; to rear (animals)',
              examples: ["饲养","饲料","饲育"]
            },
            {
              char: '养',
              pinyin: 'yǎng',
              meaning: '饲养；养育；培养',
              meaningEn: 'to raise; to nurture; to cultivate',
              example: '培养',
              examplePinyin: 'péi yǎng',
              exampleMeaning: 'to cultivate; to train; to nurture',
              examples: ["培养","饲养","养育"]
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
            {
              char: '涌',
              pinyin: 'yǒng',
              meaning: '涌现；汹涌；涌出',
              meaningEn: 'to surge; to gush; to well up',
              example: '涌现',
              examplePinyin: 'yǒng xiàn',
              exampleMeaning: 'to emerge in large numbers; to spring up',
              examples: ["涌现","汹涌","涌出"]
            },
            {
              char: '峰',
              pinyin: 'fēng',
              meaning: '山峰；峰顶；高峰',
              meaningEn: 'peak; summit; mountain top',
              example: '山峰',
              examplePinyin: 'shān fēng',
              exampleMeaning: 'mountain peak',
              examples: ["山峰","高峰","峰顶"]
            },
            {
              char: '耸',
              pinyin: 'sǒng',
              meaning: '耸立；高耸；耸动',
              meaningEn: 'to tower; to stand tall; to soar',
              example: '耸立',
              examplePinyin: 'sǒng lì',
              exampleMeaning: 'to tower; to stand tall',
              examples: ["耸立","高耸","耸入云端"]
            },
            {
              char: '阁',
              pinyin: 'gé',
              meaning: '楼阁；阁楼；阁下',
              meaningEn: 'pavilion; attic; cabinet',
              example: '楼阁',
              examplePinyin: 'lóu gé',
              exampleMeaning: 'tower; pavilion; multi-storied building',
              examples: ["楼阁","阁楼","亭台楼阁"]
            },
            {
              char: '与',
              pinyin: 'yǔ',
              meaning: '与其；参与；与众不同',
              meaningEn: 'and; with; to give; to participate',
              example: '参与',
              examplePinyin: 'cān yǔ',
              exampleMeaning: 'to participate; to take part',
              examples: ["参与","与其","与众不同"]
            },
            {
              char: '陆',
              pinyin: 'lù',
              meaning: '大陆；陆地；内陆',
              meaningEn: 'land; continent; mainland',
              example: '大陆',
              examplePinyin: 'dà lù',
              exampleMeaning: 'continent; mainland',
              examples: ["大陆","陆地","内陆"]
            },
            {
              char: '浓',
              pinyin: 'nóng',
              meaning: '浓情；浓厚；浓密',
              meaningEn: 'deep; thick; strong; rich',
              example: '浓情',
              examplePinyin: 'nóng qíng',
              exampleMeaning: 'deep affection; strong feeling',
              examples: ["浓情","浓厚","浓密"]
            },
            {
              char: '繁',
              pinyin: 'fán',
              meaning: '繁荣；繁忙；繁华',
              meaningEn: 'prosperous; busy; flourishing',
              example: '繁荣',
              examplePinyin: 'fán róng',
              exampleMeaning: 'prosperous; flourishing; thriving',
              examples: ["繁荣","繁忙","繁华"]
            },
            {
              char: '荣',
              pinyin: 'róng',
              meaning: '繁荣；荣誉；光荣',
              meaningEn: 'prosperous; glory; honor',
              example: '光荣',
              examplePinyin: 'guāng róng',
              exampleMeaning: 'glorious; honorable',
              examples: ["光荣","繁荣","荣誉"]
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
            {
              char: '传',
              pinyin: 'chuán',
              meaning: '传统；流传；传说',
              meaningEn: 'to pass on; to transmit; tradition',
              example: '流传',
              examplePinyin: 'liú chuán',
              exampleMeaning: 'to spread; to be passed down',
              examples: ["流传","传统","传说"]
            },
            {
              char: '统',
              pinyin: 'tǒng',
              meaning: '传统；统一；系统',
              meaningEn: 'tradition; to unite; system',
              example: '传统',
              examplePinyin: 'chuán tǒng',
              exampleMeaning: 'tradition; traditional',
              examples: ["传统","统一","系统"]
            },
            {
              char: '宵',
              pinyin: 'xiāo',
              meaning: '元宵；通宵；宵禁',
              meaningEn: 'night; (in 元宵: Lantern Festival)',
              example: '元宵',
              examplePinyin: 'yuán xiāo',
              exampleMeaning: 'Lantern Festival; glutinous rice ball',
              examples: ["元宵","元宵节","通宵"]
            },
            {
              char: '巷',
              pinyin: 'xiàng',
              meaning: '小巷；街巷；巷子',
              meaningEn: 'alley; lane; narrow street',
              example: '小巷',
              examplePinyin: 'xiǎo xiàng',
              exampleMeaning: 'alley; narrow lane',
              examples: ["小巷","街巷","巷子"]
            },
            {
              char: '祭',
              pinyin: 'jì',
              meaning: '祭扫；祭祀；祭奠',
              meaningEn: 'to offer sacrifice; to worship ancestors',
              example: '祭扫',
              examplePinyin: 'jì sǎo',
              exampleMeaning: 'to visit and clean ancestral graves',
              examples: ["祭扫","祭祀","祭奠"]
            },
            {
              char: '堂',
              pinyin: 'táng',
              meaning: '堂屋；课堂；堂兄',
              meaningEn: 'hall; main room; classroom',
              example: '课堂',
              examplePinyin: 'kè táng',
              exampleMeaning: 'classroom; class',
              examples: ["课堂","堂屋","礼堂"]
            },
            {
              char: '乞',
              pinyin: 'qǐ',
              meaning: '乞巧；乞求；乞丐',
              meaningEn: 'to beg; to implore; (in 乞巧: Qixi Festival custom)',
              example: '乞巧',
              examplePinyin: 'qǐ qiǎo',
              exampleMeaning: 'to pray for skill (Qixi tradition)',
              examples: ["乞巧","乞求","乞丐"]
            },
            {
              char: '巧',
              pinyin: 'qiǎo',
              meaning: '乞巧；灵巧；巧妙',
              meaningEn: 'skillful; clever; ingenious',
              example: '灵巧',
              examplePinyin: 'líng qiǎo',
              exampleMeaning: 'nimble; deft; dexterous',
              examples: ["灵巧","巧妙","乞巧"]
            },
            {
              char: '郎',
              pinyin: 'láng',
              meaning: '牛郎；郎君；新郎',
              meaningEn: 'young man; bridegroom; (in 牛郎: cowherd)',
              example: '牛郎',
              examplePinyin: 'niú láng',
              exampleMeaning: 'Cowherd (character in Qixi legend)',
              examples: ["牛郎","新郎","郎君"]
            },
            {
              char: '饼',
              pinyin: 'bǐng',
              meaning: '月饼；饼干；烙饼',
              meaningEn: 'cake; pastry; flat bread',
              example: '月饼',
              examplePinyin: 'yuè bǐng',
              exampleMeaning: 'mooncake (Mid-Autumn Festival)',
              examples: ["月饼","饼干","烙饼"]
            },
            {
              char: '赏',
              pinyin: 'shǎng',
              meaning: '赏月；欣赏；赏花',
              meaningEn: 'to enjoy; to appreciate; to admire',
              example: '赏月',
              examplePinyin: 'shǎng yuè',
              exampleMeaning: 'to admire the moon',
              examples: ["赏月","欣赏","赏花"]
            },
            {
              char: '菊',
              pinyin: 'jú',
              meaning: '菊花；赏菊；菊展',
              meaningEn: 'chrysanthemum',
              example: '菊花',
              examplePinyin: 'jú huā',
              exampleMeaning: 'chrysanthemum',
              examples: ["菊花","赏菊","菊展"]
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
            {
              char: '类',
              pinyin: 'lèi',
              meaning: '种类；人类；类似',
              meaningEn: 'kind; type; category',
              example: '种类',
              examplePinyin: 'zhǒng lèi',
              exampleMeaning: 'kind; type; variety',
              examples: ["种类","人类","类似"]
            },
            {
              char: '漂',
              pinyin: 'piào',
              meaning: '漂亮；漂白；漂浮',
              meaningEn: 'pretty; to bleach; to float',
              example: '漂亮',
              examplePinyin: 'piào liang',
              exampleMeaning: 'pretty; beautiful; good-looking',
              examples: ["漂亮","漂白","漂浮"]
            },
            {
              char: '珍',
              pinyin: 'zhēn',
              meaning: '珍贵；珍惜；珍品',
              meaningEn: 'precious; to treasure; rare',
              example: '珍贵',
              examplePinyin: 'zhēn guì',
              exampleMeaning: 'precious; valuable',
              examples: ["珍贵","珍惜","珍品"]
            },
            {
              char: '饰',
              pinyin: 'shì',
              meaning: '装饰；首饰；饰品',
              meaningEn: 'ornament; to decorate; jewelry',
              example: '装饰',
              examplePinyin: 'zhuāng shì',
              exampleMeaning: 'to decorate; decoration',
              examples: ["装饰","首饰","饰品"]
            },
            {
              char: '品',
              pinyin: 'pǐn',
              meaning: '品质；物品；产品',
              meaningEn: 'product; quality; article; to taste',
              example: '物品',
              examplePinyin: 'wù pǐn',
              exampleMeaning: 'article; item; goods',
              examples: ["物品","品质","产品"]
            },
            {
              char: '随',
              pinyin: 'suí',
              meaning: '随着；随意；随手',
              meaningEn: 'to follow; along with; at will',
              example: '随着',
              examplePinyin: 'suí zhe',
              exampleMeaning: 'along with; following',
              examples: ["随着","随意","随手"]
            },
            {
              char: '易',
              pinyin: 'yì',
              meaning: '容易；交易；不易',
              meaningEn: 'easy; to exchange; trade',
              example: '交易',
              examplePinyin: 'jiāo yì',
              exampleMeaning: 'trade; transaction; deal',
              examples: ["交易","容易","不易"]
            },
            {
              char: '损',
              pinyin: 'sǔn',
              meaning: '损失；破损；损坏',
              meaningEn: 'to lose; to damage; loss',
              example: '损失',
              examplePinyin: 'sǔn shī',
              exampleMeaning: 'loss; damage',
              examples: ["损失","破损","损坏"]
            },
            {
              char: '赚',
              pinyin: 'zhuàn',
              meaning: '赚钱；赚到；赚取',
              meaningEn: 'to earn; to make a profit',
              example: '赚钱',
              examplePinyin: 'zhuàn qián',
              exampleMeaning: 'to make money; to earn money',
              examples: ["赚钱","赚到","赚取"]
            },
            {
              char: '赔',
              pinyin: 'péi',
              meaning: '赔钱；赔偿；亏赔',
              meaningEn: 'to lose money; to compensate; at a loss',
              example: '赔钱',
              examplePinyin: 'péi qián',
              exampleMeaning: 'to lose money; to take a loss',
              examples: ["赔钱","赔偿","亏赔"]
            },
            {
              char: '购',
              pinyin: 'gòu',
              meaning: '购买；购物；购入',
              meaningEn: 'to purchase; to buy',
              example: '购买',
              examplePinyin: 'gòu mǎi',
              exampleMeaning: 'to purchase; to buy',
              examples: ["购买","购物","购入"]
            },
            {
              char: '贫',
              pinyin: 'pín',
              meaning: '贫穷；贫困；贫乏',
              meaningEn: 'poor; impoverished; lacking',
              example: '贫穷',
              examplePinyin: 'pín qióng',
              exampleMeaning: 'poor; poverty-stricken',
              examples: ["贫穷","贫困","贫乏"]
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
            {
              char: '菠',
              pinyin: 'bō',
              meaning: '菠菜；菠萝；菠菜汁',
              meaningEn: 'spinach (in 菠菜); pineapple (in 菠萝)',
              example: '菠菜',
              examplePinyin: 'bō cài',
              exampleMeaning: 'spinach',
              examples: ["菠菜","菠萝","菠菜汁"]
            },
            {
              char: '煎',
              pinyin: 'jiān',
              meaning: '煎蛋；煎饼；香煎',
              meaningEn: 'to pan-fry; to fry in shallow oil',
              example: '煎蛋',
              examplePinyin: 'jiān dàn',
              exampleMeaning: 'fried egg',
              examples: ["煎蛋","煎饼","香煎"]
            },
            {
              char: '腐',
              pinyin: 'fǔ',
              meaning: '豆腐；腐烂；腐败',
              meaningEn: 'tofu; rotten; corrupt',
              example: '豆腐',
              examplePinyin: 'dòu fu',
              exampleMeaning: 'tofu; bean curd',
              examples: ["豆腐","腐烂","腐败"]
            },
            {
              char: '煮',
              pinyin: 'zhǔ',
              meaning: '煮饭；煮熟；水煮',
              meaningEn: 'to boil; to cook',
              example: '煮饭',
              examplePinyin: 'zhǔ fàn',
              exampleMeaning: 'to cook rice; to cook a meal',
              examples: ["煮饭","水煮","煮熟"]
            },
            {
              char: '爆',
              pinyin: 'bào',
              meaning: '爆炒；爆米花；爆发',
              meaningEn: 'to explode; to quick-fry; to burst',
              example: '爆炒',
              examplePinyin: 'bào chǎo',
              exampleMeaning: 'to stir-fry over high heat',
              examples: ["爆炒","爆米花","爆发"]
            },
            {
              char: '炖',
              pinyin: 'dùn',
              meaning: '炖肉；慢炖；炖汤',
              meaningEn: 'to stew; to braise',
              example: '炖肉',
              examplePinyin: 'dùn ròu',
              exampleMeaning: 'stewed meat; braised meat',
              examples: ["炖肉","慢炖","炖汤"]
            },
            {
              char: '蘑',
              pinyin: 'mó',
              meaning: '蘑菇；香蘑；蘑菇汤',
              meaningEn: 'mushroom (first character of 蘑菇)',
              example: '蘑菇',
              examplePinyin: 'mó gu',
              exampleMeaning: 'mushroom',
              examples: ["蘑菇","香蘑","蘑菇汤"]
            },
            {
              char: '菇',
              pinyin: 'gū',
              meaning: '蘑菇；香菇；金针菇',
              meaningEn: 'mushroom (second character of 蘑菇)',
              example: '香菇',
              examplePinyin: 'xiāng gū',
              exampleMeaning: 'shiitake mushroom',
              examples: ["香菇","蘑菇","金针菇"]
            },
            {
              char: '蒸',
              pinyin: 'zhēng',
              meaning: '蒸饺；蒸熟；蒸汽',
              meaningEn: 'to steam',
              example: '蒸饺',
              examplePinyin: 'zhēng jiǎo',
              exampleMeaning: 'steamed dumplings',
              examples: ["蒸饺","蒸熟","蒸汽"]
            },
            {
              char: '饺',
              pinyin: 'jiǎo',
              meaning: '饺子；蒸饺；水饺',
              meaningEn: 'dumpling',
              example: '饺子',
              examplePinyin: 'jiǎo zi',
              exampleMeaning: 'dumpling',
              examples: ["饺子","水饺","蒸饺"]
            },
            {
              char: '炸',
              pinyin: 'zhá',
              meaning: '油炸；炸鸡；炸酱',
              meaningEn: 'to deep-fry',
              example: '油炸',
              examplePinyin: 'yóu zhá',
              exampleMeaning: 'deep-fried',
              examples: ["油炸","炸鸡","炸酱"]
            },
            {
              char: '酱',
              pinyin: 'jiàng',
              meaning: '炸酱；酱油；豆瓣酱',
              meaningEn: 'sauce; paste; soy sauce',
              example: '酱油',
              examplePinyin: 'jiàng yóu',
              exampleMeaning: 'soy sauce',
              examples: ["酱油","炸酱","豆瓣酱"]
            },
            {
              char: '粥',
              pinyin: 'zhōu',
              meaning: '稀饭；八宝粥；白粥',
              meaningEn: 'porridge; congee',
              example: '白粥',
              examplePinyin: 'bái zhōu',
              exampleMeaning: 'plain congee; plain rice porridge',
              examples: ["白粥","八宝粥","稀粥"]
            },
          ]
        },
        {
          number: 0,
          unit: 3,
          title: '语文园地三',
          words: [
            {
              char: '津',
              pinyin: 'jīn',
              meaning: '津津有味；天津；津贴',
              meaningEn: 'with relish; (place name Tianjin); subsidy',
              example: '津津有味',
              examplePinyin: 'jīn jīn yǒu wèi',
              exampleMeaning: 'with great relish; with keen interest',
              examples: ["津津有味","天津","津贴"]
            },
            {
              char: '溜',
              pinyin: 'liū',
              meaning: '香喷喷；溜走；溜冰',
              meaningEn: 'smooth; to sneak away; to skate',
              example: '溜走',
              examplePinyin: 'liū zǒu',
              exampleMeaning: 'to slip away; to sneak off',
              examples: ["溜走","溜冰","滑溜"]
            },
            {
              char: '辣',
              pinyin: 'là',
              meaning: '辣椒；麻辣；香辣',
              meaningEn: 'spicy; hot; pungent',
              example: '辣椒',
              examplePinyin: 'là jiāo',
              exampleMeaning: 'chili pepper',
              examples: ["辣椒","麻辣","香辣"]
            },
            {
              char: '乎',
              pinyin: 'hū',
              meaning: '香喷喷乎乎；乎其；似乎',
              meaningEn: 'particle indicating state; seemingly',
              example: '似乎',
              examplePinyin: 'sì hū',
              exampleMeaning: 'seemingly; as if; it seems',
              examples: ["似乎","热乎乎","香喷喷"]
            },
            {
              char: '喷',
              pinyin: 'pèn',
              meaning: '香喷喷；喷香；喷出',
              meaningEn: 'fragrant; to spray; to spurt',
              example: '香喷喷',
              examplePinyin: 'xiāng pèn pèn',
              exampleMeaning: 'deliciously fragrant; appetizingly aromatic',
              examples: ["香喷喷","喷香","喷出"]
            },
            {
              char: '腻',
              pinyin: 'nì',
              meaning: '油腻；腻味；细腻',
              meaningEn: 'greasy; oily; tired of; smooth',
              example: '油腻',
              examplePinyin: 'yóu nì',
              exampleMeaning: 'greasy; oily',
              examples: ["油腻","细腻","腻味"]
            },
            {
              char: '绵',
              pinyin: 'mián',
              meaning: '软绵绵；绵延；丝绵',
              meaningEn: 'soft; continuous; silk floss',
              example: '软绵绵',
              examplePinyin: 'ruǎn mián mián',
              exampleMeaning: 'soft and fluffy; cottony soft',
              examples: ["软绵绵","绵延","丝绵"]
            },
            {
              char: '脆',
              pinyin: 'cuì',
              meaning: '香脆；脆嫩；清脆',
              meaningEn: 'crispy; crunchy; brittle',
              example: '香脆',
              examplePinyin: 'xiāng cuì',
              exampleMeaning: 'crispy and delicious',
              examples: ["香脆","脆嫩","清脆"]
            },
            {
              char: '邦',
              pinyin: 'bāng',
              meaning: '邦国；友邦；联邦',
              meaningEn: 'country; nation; state',
              example: '联邦',
              examplePinyin: 'lián bāng',
              exampleMeaning: 'federation; federal',
              examples: ["联邦","友邦","邦国"]
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
            {
              char: '盒',
              pinyin: 'hé',
              meaning: '盒子；礼盒；铅笔盒',
              meaningEn: 'box; case; container',
              example: '盒子',
              examplePinyin: 'hé zi',
              exampleMeaning: 'box; case',
              examples: ["盒子","礼盒","铅笔盒"]
            },
            {
              char: '聊',
              pinyin: 'liáo',
              meaning: '聊天；闲聊；聊一聊',
              meaningEn: 'to chat; to talk casually',
              example: '聊天',
              examplePinyin: 'liáo tiān',
              exampleMeaning: 'to chat; to have a conversation',
              examples: ["聊天","闲聊","聊一聊"]
            },
            {
              char: '坪',
              pinyin: 'píng',
              meaning: '草坪；坪地；停机坪',
              meaningEn: 'flat ground; lawn; tarmac',
              example: '草坪',
              examplePinyin: 'cǎo píng',
              exampleMeaning: 'lawn; grass field',
              examples: ["草坪","停机坪","坪地"]
            },
            {
              char: '郁',
              pinyin: 'yù',
              meaning: '郁金香；郁郁葱葱；郁闷',
              meaningEn: 'fragrant; lush; (in 郁金香: tulip)',
              example: '郁金香',
              examplePinyin: 'yù jīn xiāng',
              exampleMeaning: 'tulip',
              examples: ["郁金香","郁郁葱葱","郁闷"]
            },
            {
              char: '囱',
              pinyin: 'cōng',
              meaning: '烟囱；烟囱口；大烟囱',
              meaningEn: 'chimney; flue',
              example: '烟囱',
              examplePinyin: 'yān cōng',
              exampleMeaning: 'chimney; smokestack',
              examples: ["烟囱","烟囱口","大烟囱"]
            },
            {
              char: '叮',
              pinyin: 'dīng',
              meaning: '叮咛；叮嘱；叮叮当当',
              meaningEn: 'to urge; to remind; tinkling sound',
              example: '叮嘱',
              examplePinyin: 'dīng zhǔ',
              exampleMeaning: 'to urge; to warn; to remind',
              examples: ["叮嘱","叮咛","叮叮当当"]
            },
            {
              char: '咛',
              pinyin: 'níng',
              meaning: '叮咛；千叮咛；再三叮咛',
              meaningEn: '(in 叮咛: to urge repeatedly)',
              example: '叮咛',
              examplePinyin: 'dīng níng',
              exampleMeaning: 'to urge; to exhort; to remind repeatedly',
              examples: ["叮咛","千叮咛","再三叮咛"]
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
            {
              char: '渡',
              pinyin: 'dù',
              meaning: '渡口；渡船；渡过',
              meaningEn: 'ferry crossing; to cross (water)',
              example: '渡口',
              examplePinyin: 'dù kǒu',
              exampleMeaning: 'ferry crossing; ford',
              examples: ["渡口","渡船","渡过"]
            },
            {
              char: '荫',
              pinyin: 'yìn',
              meaning: '树荫；绿荫；荫凉',
              meaningEn: 'shade; shelter of a tree',
              example: '树荫',
              examplePinyin: 'shù yìn',
              exampleMeaning: 'shade of a tree',
              examples: ["树荫","绿荫","荫凉"]
            },
            {
              char: '蔽',
              pinyin: 'bì',
              meaning: '遮蔽；隐蔽；蔽日',
              meaningEn: 'to cover; to hide; to block',
              example: '遮蔽',
              examplePinyin: 'zhē bì',
              exampleMeaning: 'to block; to shield; to cover',
              examples: ["遮蔽","隐蔽","蔽日"]
            },
            {
              char: '撑',
              pinyin: 'chēng',
              meaning: '撑开；支撑；撑伞',
              meaningEn: 'to prop open; to support; to pole',
              example: '支撑',
              examplePinyin: 'zhī chēng',
              exampleMeaning: 'to support; to prop up; to sustain',
              examples: ["支撑","撑开","撑伞"]
            },
            {
              char: '拼',
              pinyin: 'pīn',
              meaning: '拼音；拼命；拼写',
              meaningEn: 'to spell; to piece together; to risk',
              example: '拼音',
              examplePinyin: 'pīn yīn',
              exampleMeaning: 'pinyin; phonetic spelling',
              examples: ["拼音","拼命","拼写"]
            },
            {
              char: '冈',
              pinyin: 'gāng',
              meaning: '山冈；冈峦；土冈',
              meaningEn: 'ridge; hill; low mountain',
              example: '山冈',
              examplePinyin: 'shān gāng',
              exampleMeaning: 'low hill; ridge',
              examples: ["山冈","冈峦","土冈"]
            },
            {
              char: '懂',
              pinyin: 'dǒng',
              meaning: '懂得；懂事；看懂',
              meaningEn: 'to understand; to know',
              example: '懂得',
              examplePinyin: 'dǒng de',
              exampleMeaning: 'to understand; to know',
              examples: ["懂得","懂事","看懂"]
            },
            {
              char: '案',
              pinyin: 'àn',
              meaning: '答案；方案；案例',
              meaningEn: 'answer; plan; case; desk',
              example: '答案',
              examplePinyin: 'dá àn',
              exampleMeaning: 'answer; correct answer',
              examples: ["答案","方案","案例"]
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
            {
              char: '堡',
              pinyin: 'bǎo',
              meaning: '城堡；堡垒；碉堡',
              meaningEn: 'castle; fort; fortress',
              example: '城堡',
              examplePinyin: 'chéng bǎo',
              exampleMeaning: 'castle',
              examples: ["城堡","堡垒","碉堡"]
            },
            {
              char: '插',
              pinyin: 'chā',
              meaning: '插入；插画；插话',
              meaningEn: 'to insert; to plug in; to interrupt',
              example: '插入',
              examplePinyin: 'chā rù',
              exampleMeaning: 'to insert; to put in',
              examples: ["插入","插画","插话"]
            },
            {
              char: '凶',
              pinyin: 'xiōng',
              meaning: '凶猛；凶狠；凶悍',
              meaningEn: 'fierce; ferocious; ominous',
              example: '凶猛',
              examplePinyin: 'xiōng měng',
              exampleMeaning: 'fierce; ferocious; violent',
              examples: ["凶猛","凶狠","凶悍"]
            },
            {
              char: '狠',
              pinyin: 'hěn',
              meaning: '狠心；凶狠；下狠心',
              meaningEn: 'ruthless; cruel; fierce',
              example: '狠心',
              examplePinyin: 'hěn xīn',
              exampleMeaning: 'heartless; ruthless; hardhearted',
              examples: ["狠心","凶狠","下狠心"]
            },
            {
              char: '攻',
              pinyin: 'gōng',
              meaning: '进攻；攻击；攻克',
              meaningEn: 'to attack; to assault; to overcome',
              example: '进攻',
              examplePinyin: 'jìn gōng',
              exampleMeaning: 'to attack; to advance on',
              examples: ["进攻","攻击","攻克"]
            },
            {
              char: '商',
              pinyin: 'shāng',
              meaning: '商量；商议；商店',
              meaningEn: 'to discuss; commerce; merchant',
              example: '商量',
              examplePinyin: 'shāng liáng',
              exampleMeaning: 'to discuss; to consult',
              examples: ["商量","商议","商店"]
            },
            {
              char: '量',
              pinyin: 'liáng',
              meaning: '商量；测量；量力',
              meaningEn: 'to measure; to estimate; capacity',
              example: '商量',
              examplePinyin: 'shāng liáng',
              exampleMeaning: 'to discuss; to consult with',
              examples: ["商量","测量","量力"]
            },
            {
              char: '驾',
              pinyin: 'jià',
              meaning: '驾驶；驾车；驾到',
              meaningEn: 'to drive; to pilot; to harness',
              example: '驾驶',
              examplePinyin: 'jià shǐ',
              exampleMeaning: 'to drive; to pilot',
              examples: ["驾驶","驾车","驾到"]
            },
            {
              char: '轰',
              pinyin: 'hōng',
              meaning: '轰炸；轰鸣；轰动',
              meaningEn: 'to bomb; loud roar; to make a sensation',
              example: '轰炸',
              examplePinyin: 'hōng zhà',
              exampleMeaning: 'to bomb; to bombard',
              examples: ["轰炸","轰鸣","轰动"]
            },
            {
              char: '驳',
              pinyin: 'bó',
              meaning: '反驳；驳斥；批驳',
              meaningEn: 'to refute; to retort; to rebut',
              example: '反驳',
              examplePinyin: 'fǎn bó',
              exampleMeaning: 'to refute; to argue against',
              examples: ["反驳","驳斥","批驳"]
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
            {
              char: '昏',
              pinyin: 'hūn',
              meaning: '昏迷；昏暗；昏沉',
              meaningEn: 'dark; dizzy; unconscious',
              example: '昏迷',
              examplePinyin: 'hūn mí',
              exampleMeaning: 'unconscious; in a coma',
              examples: ["昏迷","昏暗","昏沉"]
            },
            {
              char: '泡',
              pinyin: 'pào',
              meaning: '泡泡；泡沫；泡水',
              meaningEn: 'bubble; foam; to soak',
              example: '泡泡',
              examplePinyin: 'pào pao',
              exampleMeaning: 'bubble',
              examples: ["泡泡","泡沫","泡水"]
            },
            {
              char: '茸',
              pinyin: 'róng',
              meaning: '毛茸茸；鹿茸；茸毛',
              meaningEn: 'fluffy; downy; velvet antler',
              example: '毛茸茸',
              examplePinyin: 'máo róng róng',
              exampleMeaning: 'fluffy; fuzzy; shaggy',
              examples: ["毛茸茸","鹿茸","茸毛"]
            },
            {
              char: '醒',
              pinyin: 'xǐng',
              meaning: '醒来；清醒；唤醒',
              meaningEn: 'to wake up; to sober up; awake',
              example: '醒来',
              examplePinyin: 'xǐng lái',
              exampleMeaning: 'to wake up; to come to',
              examples: ["醒来","清醒","唤醒"]
            },
            {
              char: '晃',
              pinyin: 'huàng',
              meaning: '摇晃；晃动；晃荡',
              meaningEn: 'to sway; to shake; to rock',
              example: '摇晃',
              examplePinyin: 'yáo huàng',
              exampleMeaning: 'to rock; to sway; to shake',
              examples: ["摇晃","晃动","晃荡"]
            },
            {
              char: '免',
              pinyin: 'miǎn',
              meaning: '免费；免除；避免',
              meaningEn: 'free of charge; to exempt; to avoid',
              example: '免费',
              examplePinyin: 'miǎn fèi',
              exampleMeaning: 'free of charge; no cost',
              examples: ["免费","免除","避免"]
            },
            {
              char: '费',
              pinyin: 'fèi',
              meaning: '费用；花费；免费',
              meaningEn: 'expense; fee; to cost; to spend',
              example: '费用',
              examplePinyin: 'fèi yòng',
              exampleMeaning: 'expense; cost; fee',
              examples: ["费用","花费","免费"]
            },
            {
              char: '列',
              pinyin: 'liè',
              meaning: '排列；列举；行列',
              meaningEn: 'to arrange; row; column; to list',
              example: '排列',
              examplePinyin: 'pái liè',
              exampleMeaning: 'to arrange; to line up',
              examples: ["排列","列举","行列"]
            },
            {
              char: '撞',
              pinyin: 'zhuàng',
              meaning: '碰撞；撞击；撞上',
              meaningEn: 'to bump into; to collide; to crash',
              example: '碰撞',
              examplePinyin: 'pèng zhuàng',
              exampleMeaning: 'to bump; to collide',
              examples: ["碰撞","撞击","撞上"]
            },
            {
              char: '贪',
              pinyin: 'tān',
              meaning: '贪心；贪玩；贪婪',
              meaningEn: 'greedy; to covet; avaricious',
              example: '贪心',
              examplePinyin: 'tān xīn',
              exampleMeaning: 'greedy; covetous',
              examples: ["贪心","贪玩","贪婪"]
            },
            {
              char: '脾',
              pinyin: 'pí',
              meaning: '脾气；好脾气；脾脏',
              meaningEn: 'temper; spleen',
              example: '脾气',
              examplePinyin: 'pí qi',
              exampleMeaning: 'temper; temperament',
              examples: ["脾气","好脾气","脾脏"]
            },
            {
              char: '婶',
              pinyin: 'shěn',
              meaning: '婶婶；婶子；大婶',
              meaningEn: "aunt (father's younger brother's wife)",
              example: '婶婶',
              examplePinyin: 'shěn shen',
              exampleMeaning: 'aunt',
              examples: ["婶婶","婶子","大婶"]
            },
          ]
        },
        {
          number: 0,
          unit: 4,
          title: '语文园地四',
          words: [
            {
              char: '陀',
              pinyin: 'tuó',
              meaning: '陀螺；陀螺仪；转陀螺',
              meaningEn: 'spinning top (toy)',
              example: '陀螺',
              examplePinyin: 'tuó luó',
              exampleMeaning: 'spinning top (toy)',
              examples: ["陀螺","陀螺仪","转陀螺"]
            },
            {
              char: '螺',
              pinyin: 'luó',
              meaning: '陀螺；螺旋；螺蛳',
              meaningEn: 'spiral; snail; (in 陀螺: spinning top)',
              example: '陀螺',
              examplePinyin: 'tuó luó',
              exampleMeaning: 'spinning top (toy)',
              examples: ["陀螺","螺旋","螺蛳"]
            },
            {
              char: '毽',
              pinyin: 'jiàn',
              meaning: '毽子；踢毽；毽球',
              meaningEn: 'shuttlecock (for kicking)',
              example: '毽子',
              examplePinyin: 'jiàn zi',
              exampleMeaning: 'shuttlecock; hacky sack',
              examples: ["毽子","踢毽","毽球"]
            },
            {
              char: '倒',
              pinyin: 'dǎo',
              meaning: '倒翁；摔倒；倒立',
              meaningEn: 'to fall; (in 倒翁: tumbler toy)',
              example: '倒翁',
              examplePinyin: 'dǎo wēng',
              exampleMeaning: 'tumbler toy; roly-poly',
              examples: ["倒翁","摔倒","倒立"]
            },
            {
              char: '翁',
              pinyin: 'wēng',
              meaning: '倒翁；老翁；翁婿',
              meaningEn: 'old man; (in 倒翁: tumbler toy)',
              example: '倒翁',
              examplePinyin: 'dǎo wēng',
              exampleMeaning: 'tumbler toy; roly-poly',
              examples: ["倒翁","老翁","翁婿"]
            },
            {
              char: '枪',
              pinyin: 'qiāng',
              meaning: '水枪；玩具枪；枪支',
              meaningEn: 'gun; rifle; water gun',
              example: '水枪',
              examplePinyin: 'shuǐ qiāng',
              exampleMeaning: 'water gun; water pistol',
              examples: ["水枪","玩具枪","枪支"]
            },
            {
              char: '橡',
              pinyin: 'xiàng',
              meaning: '橡皮；橡皮筋；橡树',
              meaningEn: 'rubber; oak tree; eraser',
              example: '橡皮',
              examplePinyin: 'xiàng pí',
              exampleMeaning: 'rubber eraser',
              examples: ["橡皮","橡皮筋","橡树"]
            },
            {
              char: '板',
              pinyin: 'bǎn',
              meaning: '滑板；黑板；平板',
              meaningEn: 'board; plank; slab',
              example: '滑板',
              examplePinyin: 'huá bǎn',
              exampleMeaning: 'skateboard; snowboard',
              examples: ["滑板","黑板","平板"]
            },
            {
              char: '控',
              pinyin: 'kòng',
              meaning: '遥控；控制；掌控',
              meaningEn: 'to control; remote control',
              example: '遥控',
              examplePinyin: 'yáo kòng',
              exampleMeaning: 'remote control',
              examples: ["遥控","控制","掌控"]
            },
            {
              char: '坦',
              pinyin: 'tǎn',
              meaning: '坦克；坦白；坦然',
              meaningEn: 'flat; frank; (in 坦克: tank)',
              example: '坦克',
              examplePinyin: 'tǎn kè',
              exampleMeaning: 'tank (military vehicle)',
              examples: ["坦克","坦白","坦然"]
            },
            {
              char: '克',
              pinyin: 'kè',
              meaning: '坦克；克服；攻克',
              meaningEn: 'to overcome; gram; (in 坦克: tank)',
              example: '坦克',
              examplePinyin: 'tǎn kè',
              exampleMeaning: 'tank (military vehicle)',
              examples: ["坦克","克服","攻克"]
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
            {
              char: '寓',
              pinyin: 'yù',
              meaning: '寓言；寓意；公寓',
              meaningEn: 'fable; to imply; apartment',
              example: '寓言',
              examplePinyin: 'yù yán',
              exampleMeaning: 'fable; parable',
              examples: ["寓言","寓意","公寓"]
            },
            {
              char: '则',
              pinyin: 'zé',
              meaning: '原则；规则；法则',
              meaningEn: 'rule; principle; standard',
              example: '原则',
              examplePinyin: 'yuán zé',
              exampleMeaning: 'principle; rule; standard',
              examples: ["原则","规则","法则"]
            },
            {
              char: '圈',
              pinyin: 'juān',
              meaning: '羊圈；圈养；圈子',
              meaningEn: 'enclosure; pen; circle',
              example: '羊圈',
              examplePinyin: 'yáng juān',
              exampleMeaning: 'sheep pen; sheepfold',
              examples: ["羊圈","圈养","圈子"]
            },
            {
              char: '叼',
              pinyin: 'diāo',
              meaning: '叼着；叼走；叼住',
              meaningEn: 'to hold in the mouth',
              example: '叼着',
              examplePinyin: 'diāo zhe',
              exampleMeaning: 'holding in the mouth',
              examples: ["叼着","叼走","叼住"]
            },
            {
              char: '坊',
              pinyin: 'fāng',
              meaning: '作坊；坊间；豆腐坊',
              meaningEn: 'workshop; lane; neighborhood',
              example: '作坊',
              examplePinyin: 'zuō fāng',
              exampleMeaning: 'small workshop; artisan shop',
              examples: ["作坊","坊间","豆腐坊"]
            },
            {
              char: '悔',
              pinyin: 'huǐ',
              meaning: '后悔；悔恨；悔改',
              meaningEn: 'to regret; to repent',
              example: '后悔',
              examplePinyin: 'hòu huǐ',
              exampleMeaning: 'to regret; to feel regret',
              examples: ["后悔","悔恨","悔改"]
            },
            {
              char: '此',
              pinyin: 'cǐ',
              meaning: '此时；因此；此处',
              meaningEn: 'this; here; now',
              example: '因此',
              examplePinyin: 'yīn cǐ',
              exampleMeaning: 'therefore; for this reason',
              examples: ["因此","此时","此处"]
            },
            {
              char: '焦',
              pinyin: 'jiāo',
              meaning: '焦急；焦虑；焦点',
              meaningEn: 'anxious; scorched; focus',
              example: '焦急',
              examplePinyin: 'jiāo jí',
              exampleMeaning: 'anxious; worried; impatient',
              examples: ["焦急","焦虑","焦点"]
            },
            {
              char: '喘',
              pinyin: 'chuǎn',
              meaning: '喘气；喘息；气喘',
              meaningEn: 'to pant; to gasp; to breathe heavily',
              example: '喘气',
              examplePinyin: 'chuǎn qì',
              exampleMeaning: 'to pant; to gasp for breath',
              examples: ["喘气","喘息","气喘"]
            },
            {
              char: '截',
              pinyin: 'jié',
              meaning: '截断；截止；截取',
              meaningEn: 'to cut off; to intercept; deadline',
              example: '截断',
              examplePinyin: 'jié duàn',
              exampleMeaning: 'to cut off; to sever',
              examples: ["截断","截止","截取"]
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
            {
              char: '靠',
              pinyin: 'kào',
              meaning: '靠近；依靠；靠边',
              meaningEn: 'to lean on; to approach; to rely on',
              example: '靠近',
              examplePinyin: 'kào jìn',
              exampleMeaning: 'to approach; to get close to',
              examples: ["靠近","依靠","靠边"]
            },
            {
              char: '而',
              pinyin: 'ér',
              meaning: '而且；然而；因而',
              meaningEn: 'and; but; yet; while',
              example: '而且',
              examplePinyin: 'ér qiě',
              exampleMeaning: 'moreover; furthermore; and',
              examples: ["而且","然而","因而"]
            },
            {
              char: '班',
              pinyin: 'bān',
              meaning: '班级；班长；全班',
              meaningEn: 'class; team; squad',
              example: '班级',
              examplePinyin: 'bān jí',
              exampleMeaning: 'class (in school); grade',
              examples: ["班级","班长","全班"]
            },
            {
              char: '倒',
              pinyin: 'dào',
              meaning: '倒过来；倒映；倒序',
              meaningEn: 'upside-down; reversed; inverted',
              example: '倒过来',
              examplePinyin: 'dào guò lái',
              exampleMeaning: 'turned over; reversed; upside-down',
              examples: ["倒过来","倒映","倒立"]
            },
            {
              char: '审',
              pinyin: 'shěn',
              meaning: '审视；审查；审批',
              meaningEn: 'to examine; to review; to audit',
              example: '审视',
              examplePinyin: 'shěn shì',
              exampleMeaning: 'to look at carefully; to scrutinize',
              examples: ["审视","审查","审批"]
            },
            {
              char: '视',
              pinyin: 'shì',
              meaning: '视力；注视；审视',
              meaningEn: 'vision; to look; to regard',
              example: '注视',
              examplePinyin: 'zhù shì',
              exampleMeaning: 'to gaze at; to watch attentively',
              examples: ["注视","视力","审视"]
            },
            {
              char: '肃',
              pinyin: 'sù',
              meaning: '严肃；肃静；肃立',
              meaningEn: 'solemn; strict; stern',
              example: '严肃',
              examplePinyin: 'yán sù',
              exampleMeaning: 'serious; solemn; stern',
              examples: ["严肃","肃静","肃立"]
            },
            {
              char: '晌',
              pinyin: 'shǎng',
              meaning: '晌午；晌饭；大晌午',
              meaningEn: 'noon; midday',
              example: '晌午',
              examplePinyin: 'shǎng wǔ',
              exampleMeaning: 'noon; midday',
              examples: ["晌午","晌饭","大晌午"]
            },
            {
              char: '悦',
              pinyin: 'yuè',
              meaning: '愉悦；悦耳；喜悦',
              meaningEn: 'happy; pleasant; pleasing',
              example: '愉悦',
              examplePinyin: 'yú yuè',
              exampleMeaning: 'joyful; happy; delighted',
              examples: ["愉悦","悦耳","喜悦"]
            },
            {
              char: '诲',
              pinyin: 'huì',
              meaning: '教诲；诲人不倦；谆谆教诲',
              meaningEn: 'to teach; to instruct; to guide',
              example: '教诲',
              examplePinyin: 'jiào huì',
              exampleMeaning: 'teaching; instruction; guidance',
              examples: ["教诲","诲人不倦","谆谆教诲"]
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
            {
              char: '驮',
              pinyin: 'tuó',
              meaning: '驮着；驮运；背驮',
              meaningEn: 'to carry on the back',
              example: '驮着',
              examplePinyin: 'tuó zhe',
              exampleMeaning: 'carrying on the back',
              examples: ["驮着","驮运","背驮"]
            },
          ]
        },
        {
          number: 0,
          unit: 5,
          title: '语文园地五',
          words: [
            {
              char: '厨',
              pinyin: 'chú',
              meaning: '厨房；厨师；厨具',
              meaningEn: 'kitchen; cook; chef',
              example: '厨房',
              examplePinyin: 'chú fáng',
              exampleMeaning: 'kitchen',
              examples: ["厨房","厨师","厨具"]
            },
            {
              char: '厕',
              pinyin: 'cè',
              meaning: '厕所；公厕；上厕所',
              meaningEn: 'toilet; restroom; bathroom',
              example: '厕所',
              examplePinyin: 'cè suǒ',
              exampleMeaning: 'toilet; restroom; bathroom',
              examples: ["厕所","公厕","上厕所"]
            },
            {
              char: '厢',
              pinyin: 'xiāng',
              meaning: '车厢；包厢；厢房',
              meaningEn: 'car (of a train); compartment; wing room',
              example: '车厢',
              examplePinyin: 'chē xiāng',
              exampleMeaning: 'train car; railway carriage',
              examples: ["车厢","包厢","厢房"]
            },
            {
              char: '厦',
              pinyin: 'shà',
              meaning: '大厦；高楼大厦；厦门',
              meaningEn: 'tall building; mansion',
              example: '大厦',
              examplePinyin: 'dà shà',
              exampleMeaning: 'large building; mansion; tower',
              examples: ["大厦","高楼大厦","大厦里"]
            },
            {
              char: '穴',
              pinyin: 'xué',
              meaning: '洞穴；穴位；穴道',
              meaningEn: 'cave; den; acupuncture point',
              example: '洞穴',
              examplePinyin: 'dòng xué',
              exampleMeaning: 'cave; cavern; lair',
              examples: ["洞穴","穴位","穴道"]
            },
            {
              char: '窟',
              pinyin: 'kū',
              meaning: '石窟；窟窩；洞窟',
              meaningEn: 'cave; den; (in 窟窩: hole)',
              example: '石窟',
              examplePinyin: 'shí kū',
              exampleMeaning: 'rock cave; grotto',
              examples: ["石窟","窟窿","洞窟"]
            },
            {
              char: '窿',
              pinyin: 'lóng',
              meaning: '窟窿；穿窟窿；破窟窿',
              meaningEn: '(in 窟窿: hole; gap)',
              example: '窟窿',
              examplePinyin: 'kū long',
              exampleMeaning: 'hole; gap; leak',
              examples: ["窟窿","穿窟窿","破窟窿"]
            },
            {
              char: '窑',
              pinyin: 'yáo',
              meaning: '窑洞；陶窑；砖窑',
              meaningEn: 'kiln; cave dwelling',
              example: '窑洞',
              examplePinyin: 'yáo dòng',
              exampleMeaning: 'cave dwelling; yaodong',
              examples: ["窑洞","陶窑","砖窑"]
            },
            {
              char: '窄',
              pinyin: 'zhǎi',
              meaning: '狭窄；窄小；宽窄',
              meaningEn: 'narrow; tight; limited',
              example: '狭窄',
              examplePinyin: 'xiá zhǎi',
              exampleMeaning: 'narrow; confined',
              examples: ["狭窄","窄小","宽窄"]
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
          number: 0,
          unit: 6,
          title: '语文园地六',
          words: [
            {
              char: '博',
              pinyin: 'bó',
              meaning: '博物馆；博学；博览',
              meaningEn: 'rich; abundant; broad; museum',
              example: '博物馆',
              examplePinyin: 'bó wù guǎn',
              exampleMeaning: 'museum',
              examples: ["博物馆","博学","博览"]
            },
            {
              char: '馆',
              pinyin: 'guǎn',
              meaning: '博物馆；图书馆；餐馆',
              meaningEn: 'hall; building; restaurant; museum',
              example: '博物馆',
              examplePinyin: 'bó wù guǎn',
              exampleMeaning: 'museum',
              examples: ["博物馆","图书馆","餐馆"]
            },
            {
              char: '览',
              pinyin: 'lǎn',
              meaning: '展览；博览；游览',
              meaningEn: 'to view; to look at; exhibition',
              example: '展览',
              examplePinyin: 'zhǎn lǎn',
              exampleMeaning: 'exhibition; to exhibit',
              examples: ["展览","博览","游览"]
            },
            {
              char: '技',
              pinyin: 'jì',
              meaning: '科技；技术；技能',
              meaningEn: 'skill; technique; technology',
              example: '科技',
              examplePinyin: 'kē jì',
              exampleMeaning: 'science and technology',
              examples: ["科技","技术","技能"]
            },
            {
              char: '育',
              pinyin: 'yù',
              meaning: '体育馆；教育；育人',
              meaningEn: 'to educate; to raise; sports',
              example: '体育馆',
              examplePinyin: 'tǐ yù guǎn',
              exampleMeaning: 'gymnasium; sports hall',
              examples: ["体育馆","教育","育人"]
            },
            {
              char: '研',
              pinyin: 'yán',
              meaning: '研究；科研；研究所',
              meaningEn: 'to research; to study; to grind',
              example: '研究',
              examplePinyin: 'yán jiū',
              exampleMeaning: 'research; to study; to investigate',
              examples: ["研究","科研","研究所"]
            },
            {
              char: '究',
              pinyin: 'jiū',
              meaning: '研究；究竟；探究',
              meaningEn: 'to study; to investigate; after all',
              example: '究竟',
              examplePinyin: 'jiū jìng',
              exampleMeaning: 'after all; in the end; exactly',
              examples: ["究竟","研究","探究"]
            },
            {
              char: '哨',
              pinyin: 'shào',
              meaning: '哨所；口哨；站哨',
              meaningEn: 'whistle; sentinel; sentry post',
              example: '口哨',
              examplePinyin: 'kǒu shào',
              exampleMeaning: 'whistle (made with mouth)',
              examples: ["口哨","哨所","站哨"]
            },
            {
              char: '诊',
              pinyin: 'zhěn',
              meaning: '诊所；门诊；诊断',
              meaningEn: 'to diagnose; diagnosis; clinic',
              example: '诊所',
              examplePinyin: 'zhěn suǒ',
              exampleMeaning: 'clinic; doctor\'s office',
              examples: ["诊所","门诊","诊断"]
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
        {
          number: 0,
          unit: 7,
          title: '语文园地七',
          words: [
            {
              char: '扫',
              pinyin: 'sǎo',
              meaning: '打扫；扫地；扫除',
              meaningEn: 'to sweep; to clean',
              example: '打扫',
              examplePinyin: 'dǎ sǎo',
              exampleMeaning: 'to clean; to sweep',
              examples: ["打扫","扫地","扫除"]
            },
            {
              char: '帚',
              pinyin: 'zhǒu',
              meaning: '扫帚；竹帚；扫帚星',
              meaningEn: 'broom',
              example: '扫帚',
              examplePinyin: 'sào zhou',
              exampleMeaning: 'broom',
              examples: ["扫帚","竹帚","扫帚星"]
            },
            {
              char: '抹',
              pinyin: 'mā',
              meaning: '抹布；擦抹；涂抹',
              meaningEn: 'to wipe; cleaning rag; to smear',
              example: '抹布',
              examplePinyin: 'mā bù',
              exampleMeaning: 'cleaning rag; dishcloth',
              examples: ["抹布","擦抹","涂抹"]
            },
            {
              char: '拖',
              pinyin: 'tuō',
              meaning: '拖把；拖地；拖曳',
              meaningEn: 'to drag; to mop; mop',
              example: '拖把',
              examplePinyin: 'tuō bǎ',
              exampleMeaning: 'mop (for floor)',
              examples: ["拖把","拖地","拖曳"]
            },
            {
              char: '簸',
              pinyin: 'bǒ',
              meaning: '簸箕；颠簸；簸动',
              meaningEn: 'dustpan; to winnow; to jolt',
              example: '簸箕',
              examplePinyin: 'bǒ jī',
              exampleMeaning: 'dustpan',
              examples: ["簸箕","颠簸","簸动"]
            },
            {
              char: '箕',
              pinyin: 'jī',
              meaning: '簸箕；畚箕；垃圾箕',
              meaningEn: 'dustpan; winnowing basket',
              example: '簸箕',
              examplePinyin: 'bǒ jī',
              exampleMeaning: 'dustpan',
              examples: ["簸箕","畚箕","垃圾箕"]
            },
            {
              char: '玻',
              pinyin: 'bō',
              meaning: '玻璃；玻璃杯；玻璃窗',
              meaningEn: 'glass (in 玻璃)',
              example: '玻璃',
              examplePinyin: 'bō li',
              exampleMeaning: 'glass; glassware',
              examples: ["玻璃","玻璃杯","玻璃窗"]
            },
            {
              char: '璃',
              pinyin: 'lí',
              meaning: '玻璃；玻璃瓶；玻璃杯',
              meaningEn: 'glass (in 玻璃)',
              example: '玻璃',
              examplePinyin: 'bō li',
              exampleMeaning: 'glass; glassware',
              examples: ["玻璃","玻璃瓶","玻璃杯"]
            },
            {
              char: '垃',
              pinyin: 'lā',
              meaning: '垃圾；垃圾桶；垃圾箱',
              meaningEn: 'garbage; trash (in 垃圾)',
              example: '垃圾',
              examplePinyin: 'lā jī',
              exampleMeaning: 'garbage; trash; rubbish',
              examples: ["垃圾","垃圾桶","垃圾箱"]
            },
            {
              char: '圾',
              pinyin: 'jī',
              meaning: '垃圾；垃圾堆；生活垃圾',
              meaningEn: 'garbage; rubbish (in 垃圾)',
              example: '垃圾',
              examplePinyin: 'lā jī',
              exampleMeaning: 'garbage; rubbish; waste',
              examples: ["垃圾","垃圾堆","生活垃圾"]
            },
          ]
        },
        {
          number: 23,
          unit: 8,
          title: '祖先的摇篮',
          words: [
            {
              char: '祖',
              pinyin: 'zǔ',
              meaning: '祖先；祖国；祖父',
              meaningEn: 'ancestor; grandfather; paternal',
              example: '祖先',
              examplePinyin: 'zǔ xiān',
              exampleMeaning: 'ancestors; forefathers',
              examples: ["祖先","祖国","祖父"]
            },
            {
              char: '掏',
              pinyin: 'tāo',
              meaning: '掏出；掏鸟蛋；掏钱',
              meaningEn: 'to take out; to reach into and pull out; to dig out',
              example: '掏出',
              examplePinyin: 'tāo chū',
              exampleMeaning: 'to take out; to pull out',
              examples: ["掏出","掏钱","掏鸟蛋"]
            },
            {
              char: '逗',
              pinyin: 'dòu',
              meaning: '逗趣；逗乐；可逗',
              meaningEn: 'to tease; to amuse; funny',
              example: '逗乐',
              examplePinyin: 'dòu lè',
              exampleMeaning: 'to amuse; to make laugh',
              examples: ["逗乐","逗趣","逗笑"]
            },
            {
              char: '蔷',
              pinyin: 'qiáng',
              meaning: '蔷薇；蔷薇花',
              meaningEn: 'rose (first character of 蔷薇)',
              example: '蔷薇',
              examplePinyin: 'qiáng wēi',
              exampleMeaning: 'rose; rosebush',
              examples: ["蔷薇","蔷薇花","野蔷薇"]
            },
            {
              char: '薇',
              pinyin: 'wēi',
              meaning: '蔷薇；薇菜；紫薇',
              meaningEn: 'rose (second character of 蔷薇); a type of fern',
              example: '蔷薇',
              examplePinyin: 'qiáng wēi',
              exampleMeaning: 'rose; rosebush',
              examples: ["蔷薇","紫薇","薇菜"]
            },
            {
              char: '逮',
              pinyin: 'dǎi',
              meaning: '逮住；逮捕；逮蝴蝶',
              meaningEn: 'to catch; to capture; to nab',
              example: '逮住',
              examplePinyin: 'dǎi zhù',
              exampleMeaning: 'to catch; to nab',
              examples: ["逮住","逮捕","逮蝴蝶"]
            },
            {
              char: '忆',
              pinyin: 'yì',
              meaning: '回忆；记忆；忆起',
              meaningEn: 'to recall; to remember; memory',
              example: '回忆',
              examplePinyin: 'huí yì',
              exampleMeaning: 'to recall; recollection; memory',
              examples: ["回忆","记忆","忆起"]
            },
            {
              char: '浓',
              pinyin: 'nóng',
              meaning: '浓绿；浓厚；浓密',
              meaningEn: 'thick; dense; strong; rich',
              example: '浓绿',
              examplePinyin: 'nóng lǜ',
              exampleMeaning: 'deep green; lush green',
              examples: ["浓绿","浓密","浓厚"]
            },
            {
              char: '蓝',
              pinyin: 'lán',
              meaning: '蓝天；蓝色；蔚蓝',
              meaningEn: 'blue',
              example: '蓝天',
              examplePinyin: 'lán tiān',
              exampleMeaning: 'blue sky',
              examples: ["蓝天","蓝色","蔚蓝"]
            },
            {
              char: '啊',
              pinyin: 'ā',
              meaning: '啊！表示感叹；啊呀',
              meaningEn: 'ah! oh! (exclamation)',
              example: '啊！',
              examplePinyin: 'ā',
              exampleMeaning: 'ah! (exclamation of surprise or wonder)',
              examples: ["啊，真美","啊！","多美啊"]
            },
            {
              char: '望',
              pinyin: 'wàng',
              meaning: '望见；眺望；希望',
              meaningEn: 'to look at; to gaze into the distance; to hope',
              example: '眺望',
              examplePinyin: 'tiào wàng',
              exampleMeaning: 'to gaze into the distance',
              examples: ["眺望","望见","希望"]
            },
            {
              char: '摘',
              pinyin: 'zhāi',
              meaning: '摘花；摘果；摘下',
              meaningEn: 'to pick; to pluck; to take off',
              example: '摘花',
              examplePinyin: 'zhāi huā',
              exampleMeaning: 'to pick flowers',
              examples: ["摘花","摘果","摘下"]
            },
            {
              char: '赛',
              pinyin: 'sài',
              meaning: '比赛；赛跑；赛车',
              meaningEn: 'to compete; competition; race',
              example: '比赛',
              examplePinyin: 'bǐ sài',
              exampleMeaning: 'competition; match; contest',
              examples: ["比赛","赛跑","赛车"]
            },
          ]
        },
        {
          number: 24,
          unit: 8,
          title: '当世界年纪还小的时候',
          words: [
            {
              char: '纪',
              pinyin: 'jì',
              meaning: '年纪；纪律；世纪',
              meaningEn: 'age; discipline; century; record',
              example: '年纪',
              examplePinyin: 'nián jì',
              exampleMeaning: 'age; years old',
              examples: ["年纪","世纪","纪律"]
            },
            {
              char: '必',
              pinyin: 'bì',
              meaning: '必须；必要；必定',
              meaningEn: 'must; certainly; necessary',
              example: '必须',
              examplePinyin: 'bì xū',
              exampleMeaning: 'must; have to; be obliged to',
              examples: ["必须","必要","必定"]
            },
            {
              char: '须',
              pinyin: 'xū',
              meaning: '必须；须要；胡须',
              meaningEn: 'must; need to; beard; whiskers',
              example: '必须',
              examplePinyin: 'bì xū',
              exampleMeaning: 'must; have to',
              examples: ["必须","须要","胡须"]
            },
            {
              char: '功',
              pinyin: 'gōng',
              meaning: '功夫；成功；用功',
              meaningEn: 'achievement; merit; skill; effort',
              example: '成功',
              examplePinyin: 'chéng gōng',
              exampleMeaning: 'to succeed; success',
              examples: ["成功","功夫","用功"]
            },
            {
              char: '譬',
              pinyin: 'pì',
              meaning: '譬如；比譬；譬喻',
              meaningEn: 'for example; to illustrate; analogy',
              example: '譬如',
              examplePinyin: 'pì rú',
              exampleMeaning: 'for example; for instance',
              examples: ["譬如","譬喻","比譬"]
            },
            {
              char: '糙',
              pinyin: 'cāo',
              meaning: '粗糙；糙米；毛糙',
              meaningEn: 'rough; coarse; crude',
              example: '粗糙',
              examplePinyin: 'cū cāo',
              exampleMeaning: 'rough; coarse; crude',
              examples: ["粗糙","糙米","毛糙"]
            },
            {
              char: '敏',
              pinyin: 'mǐn',
              meaning: '敏感；灵敏；聪敏',
              meaningEn: 'sensitive; quick; agile; clever',
              example: '灵敏',
              examplePinyin: 'líng mǐn',
              exampleMeaning: 'sensitive; keen; agile',
              examples: ["灵敏","敏感","聪敏"]
            },
            {
              char: '式',
              pinyin: 'shì',
              meaning: '方式；样式；形式',
              meaningEn: 'style; form; type; way',
              example: '方式',
              examplePinyin: 'fāng shì',
              exampleMeaning: 'way; method; manner',
              examples: ["方式","样式","形式"]
            },
            {
              char: '简',
              pinyin: 'jiǎn',
              meaning: '简单；简洁；简便',
              meaningEn: 'simple; brief; easy',
              example: '简单',
              examplePinyin: 'jiǎn dān',
              exampleMeaning: 'simple; easy; uncomplicated',
              examples: ["简单","简洁","简便"]
            },
            {
              char: '由',
              pinyin: 'yóu',
              meaning: '自由；理由；由来',
              meaningEn: 'from; by; reason; freedom',
              example: '自由',
              examplePinyin: 'zì yóu',
              exampleMeaning: 'freedom; free; liberty',
              examples: ["自由","理由","由来"]
            },
            {
              char: '睁',
              pinyin: 'zhēng',
              meaning: '睁眼；睁开；睁大',
              meaningEn: 'to open (eyes); to stare',
              example: '睁开',
              examplePinyin: 'zhēng kāi',
              exampleMeaning: 'to open (eyes)',
              examples: ["睁开","睁眼","睁大眼睛"]
            },
            {
              char: '秩',
              pinyin: 'zhì',
              meaning: '秩序；有秩序；秩然',
              meaningEn: 'order; sequence; orderly',
              example: '秩序',
              examplePinyin: 'zhì xù',
              exampleMeaning: 'order; orderliness',
              examples: ["秩序","有秩序","井然有序"]
            },
            {
              char: '序',
              pinyin: 'xù',
              meaning: '秩序；顺序；序言',
              meaningEn: 'order; sequence; preface',
              example: '顺序',
              examplePinyin: 'shùn xù',
              exampleMeaning: 'order; sequence',
              examples: ["秩序","顺序","序言"]
            },
            {
              char: '哦',
              pinyin: 'ó',
              meaning: '哦，我知道了；哦！',
              meaningEn: 'oh! (exclamation of realization or understanding)',
              example: '哦，原来如此',
              examplePinyin: 'ó，yuán lái rú cǐ',
              exampleMeaning: 'oh, so that\'s how it is',
              examples: ["哦，是吗","哦！","哦，我明白了"]
            },
            {
              char: '世',
              pinyin: 'shì',
              meaning: '世界；世纪；世上',
              meaningEn: 'world; generation; era',
              example: '世界',
              examplePinyin: 'shì jiè',
              exampleMeaning: 'world',
              examples: ["世界","世纪","世上"]
            },
            {
              char: '界',
              pinyin: 'jiè',
              meaning: '世界；边界；界限',
              meaningEn: 'boundary; world; field; realm',
              example: '世界',
              examplePinyin: 'shì jiè',
              exampleMeaning: 'world',
              examples: ["世界","边界","界限"]
            },
            {
              char: '反',
              pinyin: 'fǎn',
              meaning: '反复；反对；相反',
              meaningEn: 'opposite; to oppose; to repeat; reverse',
              example: '反复',
              examplePinyin: 'fǎn fù',
              exampleMeaning: 'repeatedly; over and over again',
              examples: ["反复","反对","相反"]
            },
            {
              char: '复',
              pinyin: 'fù',
              meaning: '反复；重复；复习',
              meaningEn: 'to repeat; to return; to recover',
              example: '重复',
              examplePinyin: 'chóng fù',
              exampleMeaning: 'to repeat; to duplicate',
              examples: ["重复","反复","复习"]
            },
            {
              char: '弄',
              pinyin: 'nòng',
              meaning: '弄清；弄懂；弄好',
              meaningEn: 'to do; to make; to handle; to play with',
              example: '弄清',
              examplePinyin: 'nòng qīng',
              exampleMeaning: 'to clarify; to figure out',
              examples: ["弄清","弄懂","弄好"]
            },
          ]
        },
        {
          number: 25,
          unit: 8,
          title: '羿射九日',
          words: [
            {
              char: '射',
              pinyin: 'shè',
              meaning: '射箭；射击；射手',
              meaningEn: 'to shoot; to fire; archery',
              example: '射箭',
              examplePinyin: 'shè jiàn',
              exampleMeaning: 'to shoot an arrow; archery',
              examples: ["射箭","射击","射手"]
            },
            {
              char: '值',
              pinyin: 'zhí',
              meaning: '值得；价值；数值',
              meaningEn: 'to be worth; value; worth',
              example: '值得',
              examplePinyin: 'zhí de',
              exampleMeaning: 'to be worth; worthwhile',
              examples: ["值得","价值","数值"]
            },
            {
              char: '熔',
              pinyin: 'róng',
              meaning: '熔化；熔岩；熔点',
              meaningEn: 'to melt; to fuse; molten',
              example: '熔化',
              examplePinyin: 'róng huà',
              exampleMeaning: 'to melt; to fuse',
              examples: ["熔化","熔岩","熔点"]
            },
            {
              char: '艰',
              pinyin: 'jiān',
              meaning: '艰难；艰辛；艰苦',
              meaningEn: 'difficult; hard; arduous',
              example: '艰难',
              examplePinyin: 'jiān nán',
              exampleMeaning: 'difficult; hard; arduous',
              examples: ["艰难","艰辛","艰苦"]
            },
            {
              char: '箭',
              pinyin: 'jiàn',
              meaning: '箭头；射箭；弓箭',
              meaningEn: 'arrow',
              example: '弓箭',
              examplePinyin: 'gōng jiàn',
              exampleMeaning: 'bow and arrow',
              examples: ["弓箭","箭头","射箭"]
            },
            {
              char: '裂',
              pinyin: 'liè',
              meaning: '裂开；破裂；裂缝',
              meaningEn: 'to split; to crack; to burst open',
              example: '裂开',
              examplePinyin: 'liè kāi',
              exampleMeaning: 'to split open; to crack open',
              examples: ["裂开","破裂","裂缝"]
            },
            {
              char: '窜',
              pinyin: 'cuàn',
              meaning: '逃窜；窜逃；乱窜',
              meaningEn: 'to flee; to scurry; to dart about',
              example: '逃窜',
              examplePinyin: 'táo cuàn',
              exampleMeaning: 'to flee; to run away in panic',
              examples: ["逃窜","乱窜","四处窜"]
            },
            {
              char: '炎',
              pinyin: 'yán',
              meaning: '炎热；炎炎烈日；炎黄',
              meaningEn: 'blazing hot; inflammation; scorching',
              example: '炎热',
              examplePinyin: 'yán rè',
              exampleMeaning: 'scorching hot; blazing',
              examples: ["炎热","炎炎烈日","炎黄子孙"]
            },
            {
              char: '庄',
              pinyin: 'zhuāng',
              meaning: '庄稼；庄园；村庄',
              meaningEn: 'village; farm; crops; solemn',
              example: '村庄',
              examplePinyin: 'cūn zhuāng',
              exampleMeaning: 'village; hamlet',
              examples: ["村庄","庄稼","庄园"]
            },
            {
              char: '稼',
              pinyin: 'jià',
              meaning: '庄稼；稼穑；农稼',
              meaningEn: 'crops; grain; to plant',
              example: '庄稼',
              examplePinyin: 'zhuāng jia',
              exampleMeaning: 'crops; farm produce',
              examples: ["庄稼","稼穑","农稼"]
            },
            {
              char: '滋',
              pinyin: 'zī',
              meaning: '滋生；滋润；滋味',
              meaningEn: 'to grow; to nourish; to moisten; taste',
              example: '滋润',
              examplePinyin: 'zī rùn',
              exampleMeaning: 'moist; to moisten; to nourish',
              examples: ["滋润","滋生","滋味"]
            },
            {
              char: '腾',
              pinyin: 'téng',
              meaning: '腾空；翻腾；热气腾腾',
              meaningEn: 'to soar; to leap; to rise; steaming',
              example: '腾空',
              examplePinyin: 'téng kōng',
              exampleMeaning: 'to soar into the sky; to rise into the air',
              examples: ["腾空","翻腾","热气腾腾"]
            },
            {
              char: '觉',
              pinyin: 'jué',
              meaning: '感觉；觉得；察觉',
              meaningEn: 'to feel; to sense; to realize',
              example: '感觉',
              examplePinyin: 'gǎn jué',
              exampleMeaning: 'feeling; sense; sensation',
              examples: ["感觉","觉得","察觉"]
            },
            {
              char: '类',
              pinyin: 'lèi',
              meaning: '人类；种类；类似',
              meaningEn: 'kind; type; category; humanity',
              example: '人类',
              examplePinyin: 'rén lèi',
              exampleMeaning: 'humanity; humankind',
              examples: ["人类","种类","类似"]
            },
            {
              char: '弓',
              pinyin: 'gōng',
              meaning: '弓箭；弓形；弓弦',
              meaningEn: 'bow (weapon); arc-shaped',
              example: '弓箭',
              examplePinyin: 'gōng jiàn',
              exampleMeaning: 'bow and arrow',
              examples: ["弓箭","弓形","弓弦"]
            },
            {
              char: '害',
              pinyin: 'hài',
              meaning: '害怕；害虫；伤害',
              meaningEn: 'harm; to fear; pest; to injure',
              example: '害怕',
              examplePinyin: 'hài pà',
              exampleMeaning: 'to be afraid; to fear',
              examples: ["害怕","害虫","伤害"]
            },
            {
              char: '此',
              pinyin: 'cǐ',
              meaning: '此时；因此；如此',
              meaningEn: 'this; here; now; thus',
              example: '因此',
              examplePinyin: 'yīn cǐ',
              exampleMeaning: 'therefore; thus; as a result',
              examples: ["因此","此时","如此"]
            },
          ]
        },
        {
          number: 0,
          unit: 8,
          title: '语文园地八',
          words: [
            {
              char: '钩',
              pinyin: 'gōu',
              meaning: '鱼钩；钩子；弯钩',
              meaningEn: 'hook; to hook',
              example: '鱼钩',
              examplePinyin: 'yú gōu',
              exampleMeaning: 'fishhook',
              examples: ["鱼钩","钩子","弯钩"]
            },
            {
              char: '铲',
              pinyin: 'chǎn',
              meaning: '铁铲；铲子；铲除',
              meaningEn: 'shovel; spade; to shovel',
              example: '铁铲',
              examplePinyin: 'tiě chǎn',
              exampleMeaning: 'iron shovel; spade',
              examples: ["铁铲","铲子","铲除"]
            },
            {
              char: '梅',
              pinyin: 'méi',
              meaning: '梅花；梅雨；腊梅',
              meaningEn: 'plum; plum blossom',
              example: '梅花',
              examplePinyin: 'méi huā',
              exampleMeaning: 'plum blossom',
              examples: ["梅花","梅雨","腊梅"]
            },
            {
              char: '柿',
              pinyin: 'shì',
              meaning: '柿子；柿饼；柿子树',
              meaningEn: 'persimmon',
              example: '柿子',
              examplePinyin: 'shì zi',
              exampleMeaning: 'persimmon (fruit)',
              examples: ["柿子","柿饼","柿子树"]
            },
            {
              char: '源',
              pinyin: 'yuán',
              meaning: '水源；资源；来源',
              meaningEn: 'source; origin; resource',
              example: '资源',
              examplePinyin: 'zī yuán',
              exampleMeaning: 'resource; natural resource',
              examples: ["资源","水源","来源"]
            },
            {
              char: '涨',
              pinyin: 'zhǎng',
              meaning: '上涨；涨水；涨潮',
              meaningEn: 'to rise; to swell; to flood',
              example: '上涨',
              examplePinyin: 'shàng zhǎng',
              exampleMeaning: 'to rise; to go up; to increase',
              examples: ["上涨","涨水","涨潮"]
            },
            {
              char: '炬',
              pinyin: 'jù',
              meaning: '火炬；火炬手；火炬传递',
              meaningEn: 'torch',
              example: '火炬',
              examplePinyin: 'huǒ jù',
              exampleMeaning: 'torch; Olympic torch',
              examples: ["火炬","火炬手","火炬传递"]
            },
            {
              char: '灿',
              pinyin: 'càn',
              meaning: '灿烂；光灿灿；灿灿',
              meaningEn: 'bright; brilliant; splendid',
              example: '灿烂',
              examplePinyin: 'càn làn',
              exampleMeaning: 'brilliant; resplendent; splendid',
              examples: ["灿烂","光灿灿","灿灿"]
            },
            {
              char: '垮',
              pinyin: 'kuǎ',
              meaning: '垮塌；垮台；倒垮',
              meaningEn: 'to collapse; to fall apart',
              example: '垮塌',
              examplePinyin: 'kuǎ tā',
              exampleMeaning: 'to collapse; to cave in',
              examples: ["垮塌","垮台","倒垮"]
            },
            {
              char: '坟',
              pinyin: 'fén',
              meaning: '坟墓；上坟；扫坟',
              meaningEn: 'grave; tomb',
              example: '坟墓',
              examplePinyin: 'fén mù',
              exampleMeaning: 'grave; tomb',
              examples: ["坟墓","上坟","扫坟"]
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
