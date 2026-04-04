
'use strict';

let debug = true,
	warning = 'This browser does not supported CSS Custom Highlight API.',
	highlight;

if (typeof Highlight !== 'undefined') {
	highlight = new Highlight();

} else {
	//log(warning);
}

var words = ['disk', 'hardy', 'cretin', 'codger', 'civil', 'create', 'tribal', 'vicar', 'acquit', 'aught', 'cantor', 'gravy', 'yonder', 'airily', 'lying', 'coping', 'gadget', 'khan', 'faze', 'rabble', 'tabor', 'sculpt', 'choc', 'rowan', 'wrath', 'doughy', 'bead', 'pukka', 'siege', 'bumph', 'lope', 'teat', 'cupid', 'quest', 'wicket', 'runner', 'cheep', 'sinful', 'taster', 'turbot', 'nubile', 'barnet', 'fugue', 'sickie', 'rode', 'hearer', 'tweet', 'brisk', 'bongos', 'toasty', 'deism', 'levity', 'bevel', 'smoky', 'lend', 'navy', 'poxy', 'garnet', 'tissue', 'paella', 'bleat', 'chintz', 'jazzed', 'rapier', 'never', 'rosy', 'pare', 'furl', 'gentle', 'sleaze', 'tidal', 'carafe', 'suave', 'dilate', 'barony', 'windy', 'feat', 'ibis', 'whimsy', 'lowly', 'bairn', 'fries', 'spigot', 'sabre', 'you', 'eczema', 'beaker', 'ting', 'dung', 'basal', 'tousle', 'marque', 'ambit', 'ian', 'dean', 'pronto', 'suture', 'vitro', 'unroll', 'daunt', 'homage', 'vexed', 'wade', 'visor', 'sconce', 'smirk', 'oven', 'cram', 'pkt', 'kin', 'scud', 'hanker', 'sylvan', 'car', 'truly', 'zinc', 'devour', 'forty', 'dime', 'laden', 'gerbil', 'pate', 'ovum', 'allude', 'lane', 'eaves', 'cutout', 'curved', 'vermin', 'gibber', 'eats', 'pud', 'mantra', 'with', 'booger', 'reopen', 'widow', 'bravo', 'aural', 'rumour', 'journo', 'assay', 'movie', 'laird', 'bight', 'vanity', 'wrote', 'garlic', 'caring', 'rigour', 'oppose', 'aroma', 'fern', 'nova', 'fiord', 'pelmet', 'coolie', 'fused', 'hols', 'metal', 'wept', 'wasted', 'wattle', 'cloth', 'lens', 'handy', 'jumper', 'disuse', 'caner', 'gurney', 'argon', 'hussy', 'fame', 'sauce', 'gird', 'image', 'lath', 'tush', 'petite', 'inlet', 'bowler', 'parent', 'waxen', 'phwoar', 'allow', 'evilly', 'glibly', 'rind', 'plummy', 'lair', 'motel', 'jiggy', 'bleak', 'phlox', 'ode', 'bong', 'soapy', 'ribbon', 'creamy', 'bogey', 'scaly', 'coder', 'eight', 'ashen', 'fluted', 'colic', 'dray', 'italic', 'ostler', 'pulpy', 'kayak', 'gruel', 'six', 'navel', 'fairly', 'fondue', 'catsup', 'mule', 'tween', 'cougar', 'teach', 'apiece', 'neuron', 'eying', 'galaxy', 'docket', 'rarely', 'mutely', 'earl', 'sloth', 'scanty', 'aslant', 'silent', 'muso', 'abyss', 'sty', 'legato', 'debark', 'rubric', 'filmy', 'yippee', 'gaol', 'quash', 'jurist', 'wisdom', 'coded', 'bobby', 'satiny', 'cubit', 'sit', 'barber', 'lemony', 'pail', 'chary', 'mover', 'lading', 'riyal', 'hulk', 'hobble', 'archly', 'bushel', 'orb', 'honcho', 'kooky', 'curler', 'modest', 'nectar', 'robin', 'collie', 'knew', 'hereby', 'liable', 'jersey', 'steely', 'bison', 'settee', 'joust', 'stanza', 'sharia', 'fella', 'overdo', 'rand', 'pizza', 'glib', 'gala', 'tricky', 'divan', 'sunk', 'hula', 'system', 'ample', 'joker', 'silage', 'shrunk', 'wapiti', 'castor', 'anode', 'speech', 'gammon', 'jiggle', 'martin', 'landau', 'led', 'sandy', 'upsize', 'doozy', 'had', 'rhino', 'window', 'admire', 'urgent', 'noddle', 'popper', 'masher', 'kowtow', 'autism', 'labor', 'yard', 'skag', 'nib', 'voyeur', 'rai', 'old', 'tonal', 'kart', 'facing', 'stupor', 'servo', 'fritz', 'reed', 'polo', 'byte', 'burner', 'augury', 'trike', 'intake', 'wren', 'trend', 'bombed', 'tidbit', 'bearer', 'dweeb', 'quaint', 'angina', 'edgy', 'fin', 'sown', 'threat', 'tanker', 'mishit', 'refit', 'arcade', 'closed', 'sate', 'strata', 'schwa', 'frayed', 'sexism', 'florin', 'elf', 'sprite', 'mam', 'litmus', 'server', 'facet', 'portal', 'yearly', 'baller', 'astern', 'linger', 'lunar', 'aura', 'nausea', 'twill', 'oath', 'spiel', 'paling', 'sister', 'genie', 'sect', 'bliss', 'oeuvre', 'qwerty', 'darken', 'jumbo', 'rancid', 'canker', 'amble', 'humid', 'giddy', 'baton', 'auger', 'dinky', 'envoy', 'vellum', 'tenet', 'musket', 'kernel', 'cringe', 'mullet', 'vim', 'kaput', 'titchy', 'scotch', 'lobe', 'purl', 'dolly', 'rump', 'humbug', 'barb', 'seitan', 'buyout', 'sat', 'county', 'noon', 'abort', 'radar', 'wry', 'geez', 'toddle', 'lodger', 'marten', 'purify', 'sleigh', 'unwary', 'simply', 'nearby', 'guano', 'adios', 'ivy', 'caulk', 'cedar', 'verify', 'akimbo', 'ensure', 'fealty', 'floe', 'moated', 'fest', 'picky', 'wobble', 'patio', 'saith', 'thy', 'hymen', 'manila', 'polite', 'pram', 'barn', 'manic', 'fairy', 'ninety', 'stagey', 'arrow', 'caber', 'inert', 'peon', 'folder', 'attain', 'tbc', 'chub', 'deary', 'ravish', 'mayo', 'frizzy', 'puffer', 'imbed', 'tern', 'exert', 'dang', 'actor', 'calve', 'took', 'tiling', 'gloom', 'nit', 'slurry', 'impure', 'news', 'ozone', 'pah', 'curtly', 'derby', 'fascia', 'deed', 'leapt', 'wazoo', 'mullah', 'droop', 'helm', 'gazump', 'useful', 'puppet', 'tome', 'exotic', 'snoop', 'lanky', 'armada', 'corer', 'gown', 'cabin', 'razor', 'bender', 'twain', 'coz', 'blanch', 'crisis', 'coyly', 'zap', 'tweak', 'vastly', 'these', 'bewail', 'mammal', 'enlist', 'sudoku', 'eerie', 'listed', 'pyjama', 'gusher', 'pence', 'avid', 'stow', 'merge', 'markka', 'peace', 'skewed', 'debunk', 'comms', 'mitre', 'burger', 'nudist', 'pumice', 'witty', 'skimpy', 'glassy', 'gratin', 'vector', 'arbour', 'wiggle', 'worker', 'ormolu', 'meant', 'haj', 'poky', 'potash', 'prone', 'corpus', 'wicker', 'gaily', 'butch', 'nads', 'craven', 'nicely', 'iamb', 'sear', 'sapper', 'beadle', 'tiff', 'loopy', 'flatly', 'daemon', 'kibitz', 'redden', 'retch', 'canst', 'crater', 'soca', 'sloop', 'ninja', 'roller', 'silk', 'maid', 'narked', 'fender', 'ford', 'spine', 'famed', 'yours', 'prise', 'motif', 'lurid', 'helmet', 'barque', 'were', 'ghee', 'furore', 'grater', 'valid', 'behalf', 'varied', 'wonky', 'relic', 'snuck', 'asthma', 'plc', 'begin', 'warble', 'lit', 'gusto', 'lotsa', 'schmo', 'snook', 'rabies', 'recur', 'eschew', 'burble', 'bronco', 'deafen', 'affect', 'abroad', 'dorsal', 'wodge', 'ragbag', 'morrow', 'remix', 'oasis', 'rosin', 'quay', 'leaden', 'zapper', 'inlaid', 'talon', 'tiled', 'lava', 'berry', 'carob', 'new', 'rad', 'mussel', 'edify', 'mealie', 'reflex', 'soothe', 'sensor', 'turner', 'sunder', 'crouch', 'rascal', 'pus', 'goodie', 'nonfat', 'puffy', 'venom', 'maser', 'ameba', 'entity', 'earn', 'griot', 'frill', 'stuffy', 'noir', 'lordly', 'peeve', 'valve', 'scarab', 'cutlet', 'puce', 'heyday', 'pommy', 'uncoil', 'cesium', 'baron', 'dearly', 'fie', 'tactic', 'pedalo', 'wadi', 'convey', 'apt', 'uncork', 'fig', 'aide', 'cater', 'perky', 'muzzy', 'oodles', 'tom', 'health', 'shh', 'conker', 'filial', 'delve', 'not', 'guv', 'tapas', 'maven', 'chalet', 'supine', 'hinder', 'lento', 'foible', 'rice', 'albino', 'yoga', 'scads', 'puss', 'glower', 'syphon', 'bland', 'dressy', 'evoke', 'gutted', 'rococo', 'caste', 'pang', 'buxom', 'length', 'energy', 'blond', 'disher', 'gory', 'fridge', 'wisely', 'hoofer', 'hat', 'hen', 'spiny', 'wool', 'velour', 'cayman', 'taffy', 'onyx', 'phoney', 'leftie', 'satyr', 'lunge', 'juror', 'awed', 'priory', 'wisp', 'psst', 'anther', 'cigar', 'lecher', 'popery', 'mutate', 'denial', 'gizmo', 'moss', 'manly', 'wily', 'missal', 'parry', 'quire', 'sniper', 'ascot', 'law', 'minnow', 'react', 'batch', 'sonnet', 'boater', 'dolour', 'slushy', 'goalie', 'foment', 'prof', 'loam', 'righto', 'fluffy', 'getup', 'dryad', 'sera', 'noun', 'senna', 'recoup', 'zipper', 'boyish', 'mega', 'cannot', 'dirt', 'unsure', 'hooey', 'smarts', 'afoul', 'crony', 'bur', 'pacify', 'neatly', 'titled', 'brill', 'wizard', 'breech', 'baggy', 'bummer', 'lithe', 'woodsy', 'spunky', 'peseta', 'haste', 'cony', 'mania', 'tuba', 'rusk', 'reap', 'chore', 'carton', 'harlot', 'began', 'azure', 'chapel', 'taxman', 'shew', 'cheers', 'dowry', 'ageing', 'myopic', 'banter', 'timber', 'outing', 'ark', 'nacre', 'woe', 'numpty', 'strove', 'deify', 'macho', 'basic', 'oozy', 'whey', 'sleuth', 'recap', 'scat', 'booth', 'barium', 'hub', 'ribald', 'scarey', 'wacky', 'steed', 'drank', 'yucca', 'tycoon', 'wiener', 'sae', 'dote', 'galoot', 'thru', 'crud', 'artery', 'calico', 'sinker', 'trio', 'scold', 'chador', 'node', 'clover', 'their', 'indeed', 'icy', 'smeary', 'safety', 'silica', 'deform', 'chunky', 'tummy', 'rebuke', 'infuse', 'loaded', 'hallo', 'bendy', 'brooch', 'yuppie', 'anorak', 'rueful', 'leeway', 'tarsus', 'sprang', 'expiry', 'cruddy', 'keg', 'mimosa', 'googol', 'realty', 'appear', 'day', 'dipper', 'adage', 'colt', 'waiver', 'extern', 'harsh', 'blimp', 'sago', 'teem', 'chichi', 'tattle', 'budgie', 'sacred', 'humph', 'bossy', 'baize', 'denote', 'chancy', 'greedy', 'pepsin', 'luvvie', 'furze', 'instep', 'comfy', 'violin', 'cruel', 'earful', 'height', 'namely', 'damply', 'sir', 'jobber', 'bod', 'leafy', 'peek', 'dampen', 'pane', 'packer', 'tripod', 'jay', 'maybe', 'sultan', 'motto', 'grisly', 'stamen', 'weal', 'shears', 'untie', 'misfit', 'lively', 'seduce', 'disbar', 'folly', 'curate', 'china', 'tech', 'street', 'doddle', 'sitar', 'purely', 'defray', 'hobby', 'ergo', 'bps', 'dazzle', 'canto', 'ocker', 'finery', 'inn', 'mafia', 'cloven', 'bayou', 'thrall', 'ewe', 'dado', 'curfew', 'upkeep', 'owing', 'corked', 'yummy', 'robust', 'dreck', 'lob', 'hokum', 'croft', 'cline', 'mooch', 'adept', 'brazil', 'item', 'defuse', 'oust', 'nobly', 'oilcan', 'solace', 'apace', 'tsp', 'lose', 'chaser', 'hater', 'boxcar', 'magpie', 'inning', 'tiara', 'karzy', 'spunk', 'paving', 'nah', 'catnap', 'weapon', 'breezy', 'cornea', 'firth', 'miasma', 'cipher', 'notary', 'exalt', 'phony', 'peat', 'murk', 'pier', 'rift', 'pupa', 'rushed', 'trivia', 'lesion', 'flea', 'ending', 'liver', 'tell', 'prolix', 'bobbin', 'resale', 'moist', 'camper', 'feudal', 'hubby', 'hiking', 'quart', 'gamete', 'gonad', 'clammy', 'floury', 'ironic', 'mayhem', 'melody', 'inky', 'rumpus', 'pyre', 'gnat', 'nobble', 'coy', 'syntax', 'lyceum', 'nipple', 'tarsal', 'jailer', 'creche', 'druid', 'snide', 'poetic', 'rote', 'manky', 'harden', 'hombre', 'mouldy', 'anon', 'oldish', 'mile', 'simian', 'dregs', 'moaner', 'musty', 'hilt', 'torn', 'soccer', 'choker', 'debris', 'raze', 'browse', 'told', 'props', 'mast', 'cissy', 'apse', 'tanned', 'sultry', 'trait', 'adjust', 'knit', 'jury', 'decoy', 'welch', 'emblem', 'bobbly', 'sorbet', 'idea', 'damson', 'vulva', 'faulty', 'sylph', 'dickey', 'salon', 'wimple', 'screed', 'fakie', 'wired', 'dune', 'lough', 'maze', 'yeah', 'cavil', 'surly', 'niacin', 'leek', 'burton', 'also', 'orgasm', 'rapist', 'damsel', 'sunken', 'hootch', 'axiom', 'sulfur', 'basil', 'joyful', 'ensue', 'frog', 'nutter', 'ours', 'visage', 'food', 'cosmos', 'tilde', 'porn', 'decade', 'opiate', 'hominy', 'wassup', 'effing', 'curio', 'beech', 'dough', 'devise', 'random', 'zippo', 'slake', 'cede', 'wordy', 'iconic', 'suds', 'hinged', 'fuzzy', 'postie', 'shush', 'milieu', 'bonce', 'espy', 'tine', 'cub', 'mugger', 'blitz', 'inane', 'outwit', 'turps', 'foxy', 'gap', 'outrun', 'glazed', 'depend', 'sedan', 'creed', 'member', 'pundit', 'sewer', 'lumbar', 'webbed', 'pact', 'burro', 'viper', 'tempt', 'trying', 'war', 'quartz', 'sheath', 'gape', 'actual', 'nanny', 'siesta', 'parky', 'flak', 'stony', 'agreed', 'penny', 'surety', 'rant', 'facile', 'cum', 'mode', 'unpaid', 'woken', 'apathy', 'carter', 'cousin', 'deluxe', 'again', 'yogi', 'glum', 'ague', 'ruby', 'swag', 'sexual', 'rude', 'swampy', 'they', 'yonks', 'flair', 'voiced', 'tel', 'newly', 'flung', 'hither', 'ribbed', 'kismet', 'offal', 'combo', 'pennon', 'blog', 'hatred', 'liege', 'wean', 'cam', 'enjoin', 'bot', 'jungle', 'xenon', 'rookie', 'goods', 'iris', 'tenon', 'arson', 'fennel', 'veal', 'arable', 'betray', 'edible', 'blab', 'trippy', 'pilaff', 'shogun', 'ova', 'rower', 'abut', 'bane', 'drudge', 'dourly', 'equine', 'cairn', 'devout', 'adduce', 'git', 'trudge', 'cellar', 'antics', 'hernia', 'mutiny', 'perv', 'sander', 'hunker', 'thrush', 'nerd', 'dumbly', 'mercy', 'bedbug', 'mow', 'decaf', 'snippy', 'boldly', 'eggcup', 'mud', 'patchy', 'graded', 'harem', 'latte', 'adland', 'fulfil', 'damask', 'tier', 'petrol', 'kimono', 'veneer', 'bimbo', 'baldy', 'renew', 'armour', 'khalif', 'anklet', 'toke', 'hew', 'piazza', 'phenom', 'purity', 'goo', 'patois', 'haw', 'parish', 'eggnog', 'obtuse', 'ashram', 'slunk', 'touchy', 'sodium', 'our', 'sender', 'fauna', 'futon', 'hatter', 'septic', 'eyrie', 'stogie', 'eraser', 'busty', 'exec', 'mishap', 'merger', 'pesky', 'headed', 'knotty', 'jihad', 'par', 'duvet', 'enact', 'rouble', 'wives', 'gunky', 'neat', 'zonked', 'buddy', 'roam', 'hex', 'addle', 'emcee', 'pixie', 'schist', 'rootle', 'dildo', 'dorky', 'napkin', 'curlew', 'chosen', 'barrow', 'mucous', 'garble', 'zilch', 'soda', 'hers', 'anise', 'poteen', 'equip', 'nation', 'techno', 'shuck', 'sunny', 'usual', 'mar', 'lissom', 'scribe', 'diss', 'tibia', 'causal', 'supper', 'strew', 'octane', 'teller', 'daft', 'regal', 'suite', 'eek', 'peewit', 'befall', 'menu', 'sower', 'cliff', 'torrid', 'chaos', 'does', 'pinto', 'stud', 'tang', 'zingy', 'chef', 'cud', 'smutty', 'gamy', 'lino', 'optics', 'java', 'brewer', 'aglow', 'luster', 'whiff', 'untidy', 'seeing', 'smith', 'pcm', 'deem', 'rector', 'gotten', 'gluten', 'despot', 'naive', 'decent', 'tor', 'diddly', 'chili', 'nonce', 'forth', 'wally', 'sonata', 'oak', 'moving', 'barman', 'crazed', 'iced', 'airgun', 'suckle', 'porch', 'belted', 'flan', 'rebut', 'karmic', 'balsa', 'odds', 'job', 'copula', 'iodine', 'putt', 'choked', 'shite', 'cyst', 'girly', 'micro', 'horsey', 'nippy', 'coax', 'lately', 'jag', 'purist', 'breve', 'curdle', 'monk', 'idem', 'womb', 'afraid', 'hooter', 'paltry', 'earner', 'theirs', 'redial', 'froze', 'dell', 'turtle', 'mastic', 'plod', 'throat', 'python', 'chess', 'apple', 'sane', 'soiled', 'gotta', 'accost', 'jacket', 'trader', 'lefty', 'molten', 'franc', 'infect', 'tester', 'plaid', 'aeon', 'meat', 'awash', 'basque', 'pigsty', 'terror', 'cabana', 'sarge', 'poetry', 'odious', 'fizzy', 'nodule', 'sec', 'mojo', 'papaya', 'gipsy', 'polka', 'softly', 'dryer', 'rider', 'uncut', 'howler', 'mack', 'bcc', 'wart', 'union', 'biggie', 'demist', 'tomb', 'throve', 'unload', 'deepen', 'stucco', 'infirm', 'laser', 'redo', 'frisky', 'gauze', 'sing', 'mason', 'twelve', 'blouse', 'rumba', 'priest', 'casbah', 'civics', 'chump', 'spiky', 'punchy', 'legit', 'doping', 'goatee', 'toilet', 'torpor', 'fiesta', 'malted', 'prism', 'barley', 'alpine', 'grout', 'oxygen', 'gobble', 'hazmat', 'choler', 'afters', 'tedium', 'herbal', 'spade', 'rework', 'liquor', 'dosh', 'epee', 'musk', 'area', 'burial', 'revoke', 'whinge', 'beater', 'rich', 'miter', 'lymph', 'oar', 'tepid', 'dizzy', 'frock', 'chaste', 'khakis', 'inflow', 'octave', 'dyke', 'kudos', 'pouffe', 'potful', 'stolid', 'risky', 'hoe', 'gawky', 'meld', 'clime', 'fess', 'dynamo', 'softie', 'comer', 'strung', 'bemuse', 'revile', 'labia', 'jink', 'drench', 'fever', 'debtor', 'cameo', 'haft', 'onward', 'swami', 'drowse', 'zoned', 'radish', 'nignog', 'sifter', 'mucky', 'prison', 'gash', 'write', 'linen', 'town', 'poplin', 'tuft', 'kvetch', 'jade', 'event', 'graph', 'amaze', 'theory', 'paean', 'autumn', 'jostle', 'scour', 'puttee', 'limpid', 'coup', 'wallah', 'scram', 'banns', 'forbid', 'widget', 'awhile', 'cider', 'undo', 'yogurt', 'altar', 'wrest', 'quiff', 'liken', 'nutmeg', 'wino', 'almost', 'meek', 'unfurl', 'eulogy', 'poo', 'inter', 'photon', 'brunt', 'cog', 'focal', 'blare', 'wraith', 'nelly', 'mythic', 'aunt', 'viands', 'footer', 'brow', 'theism', 'bloke', 'skater', 'dud', 'eww', 'tusk', 'vilify', 'skies', 'send', 'coiled', 'finely', 'tiny', 'cowboy', 'lovey', 'scrum', 'agape', 'gaffe', 'pecs', 'smudgy', 'week', 'macaw', 'ballet', 'dumpy', 'aha', 'rapid', 'larynx', 'murky', 'thatch', 'deaf', 'enjoy', 'winged', 'canary', 'dozy', 'lining', 'attic', 'wintry', 'biopsy', 'dozen', 'shelf', 'idiom', 'brig', 'jagged', 'midair', 'efface', 'ere', 'dew', 'clop', 'knack', 'diver', 'sitter', 'laurel', 'henna', 'airbag', 'catgut', 'pierce', 'dapple', 'tracer', 'pike', 'bigot', 'slosh', 'cupola', 'growl', 'zephyr', 'shrewd', 'fable', 'booby', 'flimsy', 'stroll', 'seance', 'shone', 'sepia', 'putrid', 'canvas', 'upshot', 'sheila', 'islet', 'pilfer', 'artful', 'unfold', 'bedsit', 'pater', 'spongy', 'divert', 'blazer', 'fumble', 'chilli', 'vixen', 'clause', 'tram', 'ordure', 'badge', 'glob', 'vilely', 'invert', 'huge', 'heron', 'bagel', 'dimmer', 'shown', 'pampas', 'rattan', 'karma', 'dicta', 'hath', 'amend', 'self', 'saliva', 'feign', 'cob', 'morsel', 'suttee', 'deduct', 'plumed', 'dative', 'uptake', 'yokel', 'senile', 'butty', 'pomp', 'coca', 'dogma', 'befit', 'spew', 'malt', 'coolly', 'bigamy', 'deli', 'calmly', 'hazily', 'torpid', 'lotto', 'ledger', 'bumble', 'puppy', 'regale', 'dolmen', 'unsafe', 'blader', 'schtum', 'braise', 'island', 'sexy', 'gecko', 'peaty', 'fro', 'basin', 'flurry', 'marlin', 'trowel', 'ohm', 'trope', 'bullet', 'crept', 'stead', 'tutu', 'bacon', 'sweary', 'grebe', 'gamey', 'mater', 'quango', 'dragon', 'ugly', 'body', 'tropic', 'waif', 'urn', 'grotto', 'fierce', 'logic', 'sedge', 'during', 'taken', 'emote', 'welt', 'missus', 'hacker', 'tea', 'kraal', 'auto', 'whiten', 'odor', 'oiled', 'zombie', 'prang', 'lichee', 'sped', 'huffy', 'mingle', 'halon', 'themed', 'duster', 'poncho', 'organ', 'cola', 'galley', 'shrank', 'marmot', 'modern', 'haggle', 'escrow', 'fop', 'cogent', 'umlaut', 'eon', 'bulgy', 'billy', 'tarty', 'snooze', 'chick', 'auk', 'foyer', 'loggia', 'clunky', 'skimp', 'benign', 'ovoid', 'suffer', 'embalm', 'piety', 'fodder', 'wiles', 'mumble', 'sky', 'else', 'campus', 'limply', 'caliph', 'scary', 'relief', 'ray', 'sliver', 'growth', 'error', 'lax', 'crock', 'baldly', 'tardy', 'bemoan', 'finite', 'sleepy', 'pox', 'lilt', 'squad', 'cherry', 'synth', 'tare', 'belong', 'joule', 'sequel', 'sputum', 'attire', 'entry', 'evince', 'penal', 'whose', 'virus', 'poncy', 'linden', 'judo', 'cuss', 'tacky', 'worsen', 'cicada', 'papist', 'twit', 'inform', 'outlet', 'mayor', 'sicko', 'spim', 'cactus', 'minion', 'nomad', 'sold', 'boner', 'ketch', 'nymph', 'fiasco', 'yecch', 'sheet', 'vodka', 'matron', 'elapse', 'pastor', 'lapsed', 'lichen', 'clothe', 'cask', 'sheikh', 'kisser', 'faucet', 'lady', 'allure', 'vile', 'surely', 'amends', 'wert', 'soya', 'strum', 'thrive', 'loss', 'tabla', 'swept', 'stoner', 'gantry', 'musky', 'adagio', 'reheat', 'flaxen', 'instil', 'cavort', 'enrage', 'metric', 'qua', 'endive', 'stayer', 'solemn', 'lipid', 'skim', 'washer', 'rarity', 'bronc', 'prow', 'cumin', 'kelp', 'hubbub', 'misty', 'taxing', 'harken', 'flume', 'pukey', 'lancet', 'pith', 'snail', 'turves', 'subtly', 'guitar', 'bounty', 'beast', 'mayst', 'embryo', 'assure', 'gawk', 'homely', 'tyrant', 'biped', 'pallet', 'mettle', 'noose', 'pommel', 'cower', 'fryer', 'exceed', 'rove', 'parse', 'sleb', 'stumpy', 'bangle', 'menses', 'seam', 'metier', 'oik', 'limbo', 'insist', 'souk', 'slyly', 'alive', 'polar', 'barney', 'ornery', 'soul', 'aloof', 'whoop', 'sierra', 'vizier', 'pootle', 'aerate', 'dirge', 'nicety', 'rasher', 'eerily', 'cancan', 'maniac', 'moi', 'saving', 'bated', 'mulish', 'mouse', 'lexis', 'zinger', 'avowal', 'shaggy', 'quirky', 'slay', 'banal', 'captor', 'chirp', 'endear', 'dram', 'hyena', 'person', 'plank', 'louvre', 'aloud', 'broom', 'singly', 'ratio', 'babe', 'potted', 'mini', 'depot', 'cowrie', 'hone', 'nary', 'usury', 'resist', 'petty', 'fungal', 'tons', 'clang', 'gifted', 'axis', 'bratty', 'spouse', 'locket', 'whinny', 'peter', 'dearth', 'saver', 'olden', 'madly', 'myself', 'tampon', 'winner', 'opine', 'airy', 'depose', 'glop', 'talker', 'dander', 'ditzy', 'allied', 'porter', 'sew', 'starve', 'caudal', 'bailey', 'dactyl', 'kook', 'igloo', 'neigh', 'manage', 'ascent', 'unhurt', 'strife', 'pie', 'woeful', 'medico', 'skint', 'dibs', 'retool', 'slippy', 'hardly', 'heft', 'bah', 'taut', 'deduce', 'dhoti', 'pupal', 'wreath', 'vapour', 'rime', 'spay', 'skit', 'leery', 'blip', 'ecru', 'knave', 'mung', 'och', 'those', 'kale', 'papacy', 'opt', 'basset', 'skiing', 'locker', 'ouch', 'stood', 'hawser', 'moment', 'linkup', 'oaken', 'cay', 'shear', 'norm', 'widely', 'pied', 'hearse', 'wench', 'ankle', 'tavern', 'uncle', 'global', 'tufted', 'inward', 'avatar', 'therm', 'onus', 'cooler', 'radial', 'verve', 'sparky', 'hereof', 'sent', 'spotty', 'uvula', 'mirage', 'hotpot', 'vassal', 'joggle', 'trice', 'oxtail', 'elude', 'candle', 'lily', 'annexe', 'yew', 'unhook', 'fizzle', 'drapes', 'itchy', 'chrome', 'soppy', 'zither', 'spik', 'bomber', 'geese', 'gnome', 'screwy', 'chug', 'skank', 'tod', 'morph', 'privet', 'eel', 'preppy', 'waft', 'acre', 'vitals', 'lore', 'staid', 'unease', 'scoot', 'rats', 'pest', 'timer', 'banker', 'cubist', 'broach', 'sprat', 'inbred', 'adze', 'jowl', 'ivory', 'ragout', 'fury', 'simile', 'cozy', 'jus', 'beta', 'boxer', 'acne', 'sphinx', 'finch', 'gasket', 'soften', 'welsh', 'carrot', 'immune', 'flute', 'duffer', 'ass', 'hour', 'horrid', 'clinic', 'bevvy', 'tinned', 'dollop', 'farmer', 'into', 'effort', 'optic', 'upwind', 'uneasy', 'redeem', 'lairy', 'chard', 'smiley', 'banned', 'binman', 'gullet', 'guvnor', 'blurb', 'edging', 'opal', 'rotter', 'yer', 'mushy', 'cling', 'fester', 'steamy', 'perry', 'rehome', 'memory', 'emo', 'aspen', 'velar', 'yaws', 'shalt', 'drier', 'tabard', 'caving', 'tent', 'hart', 'ire', 'vial', 'unduly', 'dapper', 'spider', 'watt', 'measly', 'dude', 'revue', 'mainly', 'spicy', 'loving', 'fleecy', 'goer', 'barker', 'bedlam', 'engine', 'numbly', 'heater', 'corrie', 'cabbie', 'hypo', 'aflame', 'omega', 'harpy', 'clench', 'nett', 'cyan', 'daisy', 'sitcom', 'jazzy', 'salvo', 'rubble', 'prawn', 'dusky', 'broody', 'bub', 'await', 'pixel', 'carver', 'cutesy', 'mambo', 'staves', 'gulag', 'fiddly', 'diving', 'violet', 'payout', 'rink', 'pokey', 'shrimp', 'tomboy', 'upon', 'tomato', 'nadir', 'ashcan', 'uptown', 'patty', 'diadem', 'emboss', 'mart', 'august', 'thrum', 'lawyer', 'furred', 'coitus', 'choccy', 'should', 'shtick', 'osprey', 'owe', 'gnomic', 'crimp', 'highly', 'hourly', 'ascend', 'cubism', 'garret', 'drawer', 'exam', 'dolt', 'ahoy', 'merino', 'online', 'obese', 'begum', 'quanta', 'booty', 'spiv', 'maim', 'spritz', 'heart', 'nous', 'vocab', 'miffed', 'minx', 'skull', 'errand', 'blotto', 'cranny', 'incise', 'among', 'emit', 'foodie', 'obsess', 'mahout', 'nigh', 'sinus', 'pleb', 'tasty', 'filo', 'flared', 'fated', 'teal', 'genome', 'manger', 'spire', 'holly', 'jewel', 'obit', 'hobnob', 'fried', 'came', 'borax', 'scampi', 'twirly', 'data', 'reborn', 'bonnet', 'google', 'litany', 'vast', 'gladly', 'totem', 'rayon', 'canon', 'jinxed', 'soon', 'rotgut', 'yikes', 'sunset', 'rocker', 'sermon', 'newsy', 'ramrod', 'scurvy', 'adman', 'stably', 'hookah', 'insure', 'tryout', 'chav', 'lox', 'stoup', 'nigger', 'willow', 'blurt', 'wangle', 'doyen', 'naan', 'prized', 'abuser', 'shekel', 'bun', 'gaydar', 'looker', 'fully', 'puny', 'snazzy', 'zoning', 'plinth', 'slush', 'flux', 'rummy', 'child', 'reword', 'gray', 'campy', 'blithe', 'bling', 'deft', 'footie', 'yucky', 'hostel', 'felony', 'wetly', 'pea', 'parley', 'delta', 'fickle', 'gunman', 'vernal', 'poised', 'corker', 'winded', 'landed', 'tweedy', 'tartly', 'cruet', 'impart', 'sleet', 'guinea', 'joiner', 'waking', 'loofah', 'dodder', 'peddle', 'yeoman', 'venial', 'patsy', 'smugly', 'calk', 'fecund', 'ducal', 'hall', 'softy', 'beheld', 'caveat', 'jammed', 'nasty', 'hooped', 'flange', 'within', 'jamb', 'craic', 'jester', 'claque', 'rial', 'mixer', 'eyot', 'admit', 'pod', 'recipe', 'wigwam', 'livery', 'sporty', 'wove', 'exodus', 'probs', 'gunner', 'amity', 'reefer', 'roused', 'herpes', 'nun', 'veldt', 'pawpaw', 'dulcet', 'airbed', 'peachy', 'malice', 'oxford', 'hale', 'dowel', 'pooh', 'elm', 'seven', 'jerkin', 'gofer', 'primp', 'sphere', 'kiosk', 'slayer', 'church', 'mph', 'lice', 'asylum', 'expel', 'vinyl', 'haggis', 'ruddy', 'recant', 'panda', 'abs', 'paddy', 'advice', 'feisty', 'whorl', 'amok', 'witch', 'coot', 'squawk', 'lab', 'scared', 'weepie', 'robed', 'orator', 'yid', 'was', 'office', 'shat', 'rep', 'undue', 'pearl', 'saucy', 'fusty', 'peeler', 'genial', 'rife', 'exude', 'massed', 'sheep', 'frosty', 'feeder', 'than', 'expat', 'careen', 'darkie', 'cocky', 'vogue', 'natch', 'reuse', 'biased', 'smelly', 'thank', 'outage', 'hooves', 'money', 'fowl', 'cheery', 'rewire', 'corpse', 'homer', 'shrub', 'ocean', 'runic', 'conga', 'poly', 'duo', 'tumour', 'commie', 'golfer', 'eve', 'cello', 'sampan', 'dwell', 'cockle', 'oddly', 'thug', 'hasp', 'kirsch', 'petrel', 'joey', 'fraud', 'teasel', 'junky', 'gild', 'tinted', 'hello', 'seller', 'cheesy', 'waged', 'frail', 'onion', 'stymie', 'ersatz', 'meteor', 'weenie', 'robber', 'chap', 'calves', 'lynx', 'duty', 'tale', 'adjoin', 'cite', 'tagger', 'gasman', 'gutsy', 'toggle', 'filch', 'folio', 'ley', 'deny', 'slurp', 'cosily', 'demean', 'sourly', 'held', 'twice', 'dinar', 'kilo', 'caftan', 'shorty', 'tariff', 'fifty', 'decode', 'golden', 'kilt', 'ropey', 'daddy', 'edit', 'gland', 'hermit', 'nerdy', 'equate', 'insole', 'riser', 'wuss', 'amber', 'suitor', 'lifer', 'laud', 'votary', 'titty', 'gabby', 'larval', 'verse', 'joyous', 'year', 'deer', 'bunt', 'nope', 'saint', 'wilful', 'lisp', 'wrack', 'gaffer', 'hasty', 'gamma', 'blimey', 'mayfly', 'recent', 'yum', 'loon', 'caps', 'hoopla', 'fend', 'lusty', 'tosh', 'juicy', 'lode', 'convex', 'incur', 'urbane', 'trivet', 'phobia', 'guile', 'spume', 'seem', 'pour', 'signer', 'daffy', 'shammy', 'sad', 'gale', 'gamely', 'appal', 'jogger', 'anvil', 'kerb', 'settle', 'russet', 'jammy', 'weigh', 'sup', 'tray', 'ident', 'prong', 'yeti', 'wharf', 'citron', 'starry', 'desk', 'grower', 'jeans', 'hairy', 'spying', 'biddy', 'pout', 'toxin', 'glitch', 'subway', 'could', 'leaves', 'seamy', 'giggly', 'apply', 'forgo', 'applet', 'aloft', 'bylaw', 'reeve', 'arose', 'tinder', 'affray', 'jell', 'align', 'ran', 'beady', 'raffia', 'behold', 'forced', 'chunk', 'aft', 'acrid', 'chit', 'superb', 'saggy', 'slept', 'bray', 'orgy', 'krill', 'corn', 'ruble', 'mostly', 'impair', 'sadly', 'symbol', 'unreal', 'gratis', 'fume', 'pure', 'mosaic', 'troth', 'leper', 'verger', 'halo', 'caster', 'doubly', 'seize', 'schema', 'armful', 'mutton', 'faecal', 'angora', 'topic', 'nape', 'faeces', 'scag', 'sine', 'paid', 'podgy', 'viz', 'put', 'scone', 'clank', 'mining', 'affirm', 'wushu', 'angry', 'god', 'tonsil', 'casual', 'karate', 'bobcat', 'freely', 'nylon', 'mousy', 'jokey', 'eater', 'brag', 'nexus', 'calyx', 'arrant', 'edu', 'jelly', 'tipple', 'baboon', 'recce', 'ulna', 'coypu', 'hurtle', 'phylum', 'excite', 'ollie', 'batboy', 'hullo', 'teacup', 'morose', 'flub', 'advise', 'amidst', 'studio', 'whirr', 'since', 'elide', 'sprog', 'unlit', 'urinal', 'kimchi', 'chappy', 'nuncio', 'isobar', 'jotter', 'bib', 'lychee', 'snog', 'whisky', 'tandem', 'lop', 'forked', 'quarto', 'deaden', 'bask', 'dormer', 'coarse', 'leant', 'matt', 'rob', 'unpick', 'pistil', 'melt', 'plucky', 'acute', 'unripe', 'wit', 'splint', 'null', 'quorum', 'hut', 'verily', 'cinema', 'album', 'stewed', 'per', 'cot', 'nozzle', 'fez', 'fakir', 'flight', 'ruff', 'crux', 'wed', 'gibbon', 'grungy', 'thresh', 'sol', 'bodkin', 'typo', 'rube', 'danger', 'stifle', 'pally', 'bumf', 'yeast', 'baste', 'fumes', 'flu', 'owlish', 'cox', 'pave', 'dosser', 'toffee', 'recoil', 'homing', 'axle', 'anthem', 'booze', 'enfold', 'bode', 'ensign', 'mickey', 'canter', 'crabby', 'urine', 'balm', 'auburn', 'leader', 'repent', 'lyre', 'cursor', 'oddity', 'icebox', 'ethos', 'bandit', 'owl', 'truce', 'chatty', 'army', 'are', 'coke', 'men', 'unite', 'eager', 'cosine', 'reveal', 'undies', 'bell', 'croon', 'bluesy', 'turret', 'pucker', 'clan', 'doh', 'heroic', 'carbon', 'did', 'refute', 'rennet', 'ravage', 'morbid', 'twixt', 'mumps', 'avowed', 'which', 'path', 'spliff', 'dusty', 'submit', 'lariat', 'fusion', 'wheezy', 'user', 'legend', 'sea', 'turbo', 'confer', 'lung', 'pant', 'mouthy', 'teabag', 'wallet', 'glove', 'mender', 'hammy', 'bally', 'fiber', 'alumna', 'typing', 'doomed', 'resin', 'flaky', 'pear', 'gator', 'coccyx', 'thirty', 'phew', 'scabby', 'grumpy', 'entrap', 'segue', 'moult', 'unmask', 'greet', 'reboot', 'whoosh', 'fort', 'wooded', 'cur', 'hooky', 'piddle', 'laddie', 'dago', 'geek', 'heifer', 'weft', 'globe', 'portly', 'asset', 'exist', 'grunge', 'burqa', 'giro', 'ledge', 'fatten', 'meg', 'parch', 'ouster', 'ethic', 'mired', 'plasma', 'stanch', 'midday', 'vapid', 'cusp', 'fooser', 'drily', 'keypal', 'vestry', 'ingest', 'djinn', 'steak', 'stance', 'poodle', 'toucan', 'newbie', 'mare', 'dongle', 'rugby', 'inner', 'fay', 'theme', 'ordeal', 'define', 'quip', 'airway', 'gaming', 'quasar', 'jute', 'roomy', 'taker', 'other', 'pry', 'shaver', 'spake', 'anyhow', 'inbox', 'doing', 'lemur', 'sachet', 'smoggy', 'scally', 'boho', 'quint', 'pallid', 'tuxedo', 'roan', 'goofy', 'indigo', 'asleep', 'lender', 'warily', 'codify', 'ember', 'veiled', 'how', 'nipper', 'bought', 'walled', 'bide', 'shirk', 'intend', 'follow', 'coon', 'indoor', 'albeit', 'flyer', 'disarm', 'trod', 'anime', 'phlegm', 'fetal', 'rigid', 'imam', 'induct', 'puree', 'spinet', 'squish', 'unkind', 'yammer', 'neath', 'eject', 'gulf', 'vie', 'homily', 'owner', 'lorry', 'wok', 'gusset', 'creepy', 'creel', 'copse', 'lintel', 'brawny', 'honest', 'onside', 'fir', 'regain', 'wanly', 'morgue', 'shtum', 'peepbo', 'crutch', 'muggy', 'oughta', 'friary', 'rudder', 'linnet', 'swam', 'bole', 'eke', 'furled', 'drew', 'saucer', 'storey', 'wreak', 'sickly', 'mildly', 'weaver', 'sated', 'blown', 'inborn', 'ahead', 'quark', 'extol', 'zealot', 'yarn', 'palsy', 'wellie', 'arouse', 'manga', 'flaunt', 'kibosh', 'wife', 'hotbed', 'maw', 'tinsel', 'ammo', 'easel', 'vendor', 'pumped', 'lad', 'dredge', 'wend', 'locust', 'tat', 'eyelid', 'ail', 'neaten', 'vainly', 'flout', 'enrol', 'inroad', 'grog', 'airman', 'clubby', 'gab', 'usurer', 'cove', 'enrich', 'smarmy', 'catty', 'livid', 'forget', 'hob', 'fixity', 'bionic', 'situ', 'unlock', 'germ', 'wiring', 'alit', 'unplug', 'wanker', 'geeky', 'tranny', 'cosset', 'memo', 'techie', 'earthy', 'tragic', 'rye', 'dike', 'nimbly', 'around', 'butte', 'credo', 'unmet', 'conch', 'shaven', 'masque', 'ninny', 'undone', 'spree', 'kapok', 'clad', 'burlap', 'quince', 'wolves', 'rotate', 'serf', 'bogus', 'mogul', 'limey', 'ornate', 'outbid', 'caucus', 'cor', 'many', 'evict', 'lurk', 'litre', 'vouch', 'assign', 'heckle', 'guilty', 'pearly', 'rare', 'boozy', 'via', 'versed', 'meme', 'beaded', 'gloppy', 'syrup', 'dully', 'mincer', 'oikish', 'assert', 'afar', 'hue', 'effete', 'annals', 'renal', 'ratify', 'slut', 'pushy', 'thigh', 'drivel', 'niece', 'cabal', 'dork', 'bile', 'matzo', 'dacha', 'prissy', 'wampum', 'flew', 'bap', 'lumpy', 'vowel', 'sett', 'golf', 'month', 'fetus', 'hussar', 'dirk', 'hereto', 'tootle', 'nowt', 'carnet', 'panto', 'snugly', 'pusher', 'clef', 'belay', 'otiose', 'stooge', 'merely', 'voodoo', 'mural', 'women', 'insect', 'lover', 'amoral', 'beckon', 'vine', 'splosh', 'demote', 'aitch', 'vivo', 'ftp', 'loci', 'dahlia', 'condo', 'mallet', 'cloudy', 'sepal', 'taught', 'banana', 'primal', 'jumpy', 'turnip', 'sorry', 'relate', 'icily', 'admin', 'amass', 'whist', 'lute', 'decry', 'nodal', 'okapi', 'deacon', 'what', 'poppet', 'unwell', 'largo', 'tomcat', 'deputy', 'arcane', 'pebble', 'skulk', 'kennel', 'repay', 'afresh', 'minuet', 'hoax', 'cargo', 'oxcart', 'dither', 'tuber', 'baddie', 'exhale', 'refuel', 'needy', 'mac', 'lacuna', 'flit', 'sealed', 'prepay', 'humane', 'dewy', 'hooch', 'wiper', 'busing', 'add', 'erotic', 'bam', 'filth', 'swung', 'mead', 'avenue', 'juiced', 'splay', 'rusty', 'cent', 'and', 'fiat', 'two', 'jaded', 'ikon', 'desist', 'fleshy', 'seabed', 'soar', 'mossy', 'pellet', 'wood', 'yaw', 'darkly', 'moxie', 'bedpan', 'gerund', 'ago', 'mister', 'sarky', 'beeper', 'allay', 'truth', 'chilly', 'cravat', 'sissy', 'cadet', 'yearn', 'rather', 'vagina', 'wince', 'gauche', 'shaky', 'stoned', 'wop', 'shrew', 'ermine', 'reggae', 'spelt', 'ghetto', 'midi', 'recast', 'larva', 'rugger', 'nudity', 'gumbo', 'dieter', 'rented', 'banger', 'lewd', 'mummy', 'paunch', 'fuzz', 'fibber', 'junta', 'failed', 'reader', 'harass', 'wader', 'lucid', 'retry', 'ajar', 'ate', 'poem', 'cynic', 'berk', 'regent', 'rearm', 'bicep', 'triage', 'unhip', 'telex', 'pidgin', 'foray', 'occur', 'unless', 'smog', 'creaky', 'alone', 'eldest', 'saber', 'frag', 'mete', 'fab', 'unwise', 'squire', 'marrow', 'cutler', 'slain', 'loosen', 'pariah', 'squaw', 'buss', 'aptly', 'museum', 'pummel', 'repute', 'camber', 'pork', 'glumly', 'broth', 'barren', 'bulb', 'rappel', 'detain', 'chide', 'sushi', 'fixed', 'stripe', 'carat', 'hottie', 'idiocy', 'gluey', 'sob', 'mood', 'foetus', 'hunter', 'logo', 'robe', 'grimy', 'smite', 'betel', 'cancer', 'palate', 'skive', 'statue', 'poser', 'burbs', 'slab', 'alley', 'toots', 'runt', 'seen', 'spoor', 'shanty', 'tulip', 'pled', 'mews', 'hijab', 'cajole', 'stoked', 'sloe', 'idler', 'birch', 'halve', 'duh', 'comma', 'weblog', 'aghast', 'banish', 'atrium', 'atone', 'nuzzle', 'diddle', 'pimply', 'shire', 'dawdle', 'pissy', 'myth', 'guppy', 'cuz', 'nisi', 'classy', 'grimly', 'slowly', 'lotus', 'slinky', 'woody', 'gorgon', 'annul', 'escudo', 'peony', 'avert', 'gotcha', 'teazel', 'planer', 'fucked', 'lama', 'puma', 'toddy', 'racket', 'dreamy', 'cyborg', 'tippex', 'kaftan', 'ragtag', 'frisk', 'khazi', 'sperm', 'matins', 'engulf', 'loser', 'sift', 'discus', 'croaky', 'faff', 'rile', 'duplex', 'hefty', 'verity', 'rpm', 'ten', 'celeb', 'bless', 'pebbly', 'math', 'chest', 'alumni', 'yep', 'armed', 'grieve', 'ridge', 'defend', 'crass', 'muslin', 'guy', 'impugn', 'sleazy', 'wot', 'creek', 'chin', 'dyed', 'tad', 'pulpit', 'hiya', 'strait', 'tanner', 'soiree', 'hated', 'begot', 'timbre', 'amused', 'bathos', 'beet', 'byre', 'bleary', 'ailing', 'wrung', 'teethe', 'parlay', 'cell', 'psyche', 'bitty', 'toerag', 'tunic', 'limo', 'tacit', 'ooh', 'cognac', 'spleen', 'slang', 'unzip', 'bro', 'debug', 'yen', 'beer', 'trout', 'cardio', 'goblet', 'gadfly', 'rupee', 'balk', 'ruckus', 'sherry', 'banner', 'runny', 'sofa', 'brainy', 'gibbet', 'hasten', 'oof', 'vision', 'peanut', 'mucus', 'vein', 'minim', 'five', 'uproot', 'beanie', 'akin', 'halves', 'revamp', 'boa', 'tony', 'acme', 'turbid', 'zydeco', 'sprig', 'greed', 'bumpy', 'tarn', 'nappy', 'impede', 'regime', 'always', 'brass', 'haven', 'helium', 'caver', 'wavy', 'yuck', 'padded', 'mitten', 'tater', 'dais', 'viola', 'coma', 'pointe', 'mental', 'wedded', 'willie', 'extent', 'deploy', 'jug', 'lib', 'beau', 'racism', 'critic', 'got', 'aspic', 'gourd', 'imbue', 'sombre', 'singer', 'testy', 'denude', 'tired', 'tree', 'feeler', 'duct', 'picked', 'been', 'empire', 'levee', 'hushed', 'palace', 'pigeon', 'demon', 'ton', 'uproar', 'outran', 'diary', 'amoeba', 'otter', 'pullet', 'attach', 'bobs', 'gloomy', 'zany', 'veejay', 'mating', 'topple', 'reside', 'racy', 'septet', 'shank', 'fright', 'spryly', 'botany', 'entail', 'bargee', 'phooey', 'pager', 'gaga', 'flack', 'hon', 'fucker', 'intuit', 'fitful', 'hearth', 'kicker', 'loo', 'crab', 'donut', 'filler', 'ordain', 'flora', 'warden', 'scrimp', 'ovary', 'spurn', 'midway', 'papery', 'ssh', 'ulcer', 'serum', 'neural', 'talent', 'hiss', 'bake', 'unfit', 'dogleg', 'timing', 'denim', 'pooped', 'scab', 'calf', 'woman', 'concur', 'algae', 'callus', 'tattie', 'poofy', 'corgi', 'didst', 'theft', 'scurry', 'keno', 'tizzy', 'bridal', 'reek', 'padre', 'ant', 'brawn', 'frier', 'rune', 'grille', 'swoon', 'nachos', 'quaff', 'deftly', 'beaten', 'satire', 'mascot', 'bygone', 'perp', 'seep', 'trier', 'sector', 'engage', 'append', 'poster', 'lastly', 'goggle', 'seedy', 'tribe', 'watery', 'crappy', 'here', 'droopy', 'tuner', 'yank', 'mangy', 'attest', 'shrift', 'mallow', 'aware', 'mwah', 'kettle', 'panel', 'vista', 'oops', 'momma', 'drape', 'scant', 'racer', 'pamper', 'hiker', 'crikey', 'molder', 'scruff', 'masse', 'dodo', 'parity', 'mad', 'weeny', 'elfin', 'stocky', 'razz', 'drippy', 'tiler', 'logger', 'prove', 'dancer', 'rectal', 'angel', 'naked', 'mango', 'mite', 'life', 'gaggle', 'victim', 'dour', 'wedgie', 'gently', 'cwt', 'vested', 'trove', 'sank', 'hankie', 'anal', 'vivace', 'teapot', 'primly', 'negate', 'gamut', 'faun', 'silo', 'girder', 'sundry', 'impose', 'uncool', 'thinly', 'entire', 'kludge', 'foully', 'wooden', 'goon', 'polyp', 'judder', 'taser', 'loafer', 'tote', 'spun', 'thus', 'brandy', 'kilted', 'viscid', 'thrice', 'glade', 'duchy', 'rue', 'reload', 'cowl', 'gannet', 'emend', 'wicked', 'oily', 'modem', 'under', 'armpit', 'hanger', 'gander', 'stair', 'copier', 'steppe', 'mecca', 'stinky', 'glitz', 'vat', 'testis', 'bosh', 'doer', 'iffy', 'eunuch', 'sudsy', 'amp', 'stomp', 'whammy', 'gentry', 'holler', 'molest', 'dopy', 'lain', 'gelid', 'koala', 'asap', 'arc', 'oakum', 'forest', 'auntie', 'verso', 'aspire', 'gloved', 'fluent', 'faggot', 'gnarly', 'sonic', 'punkah', 'plaice', 'groggy', 'lout', 'hamlet', 'gaping', 'grime', 'diner', 'blew', 'road', 'where', 'gritty', 'phut', 'scummy', 'gulch', 'temple', 'bushed', 'walrus', 'deejay', 'vigor', 'bookie', 'hoop', 'sahib', 'cloy', 'faith', 'fettle', 'downy', 'vend', 'mom', 'carrel', 'unveil', 'comedy', 'payola', 'poor', 'slalom', 'vanish', 'gramme', 'hots', 'piglet', 'evolve', 'donkey', 'doodah', 'dried', 'quirk', 'drab', 'unfair', 'reaper', 'ashore', 'curtsy', 'crocus', 'teaser', 'bevy', 'doth', 'purser', 'sniffy', 'vacant', 'coir', 'dug', 'seemly', 'hubris', 'vulgar', 'loaves', 'ploy', 'brogue', 'foetal', 'typist', 'diode', 'mislay', 'tyke', 'barfly', 'siding', 'occupy', 'begun', 'coyote', 'boat', 'swat', 'genus', 'rating', 'milady', 'http', 'glom', 'yowl', 'skew', 'radium', 'razzle', 'piracy', 'webcam', 'digger', 'isle', 'whit', 'pow', 'salmon', 'chalky', 'bard', 'absorb', 'jigsaw', 'toxic', 'loamy', 'gringo', 'rupiah', 'guff', 'fact', 'beaut', 'aegis', 'rural', 'umber', 'hoarse', 'unsung', 'tying', 'scoff', 'thence', 'dine', 'warmth', 'busk', 'snarky', 'kept', 'refuge', 'spiffy', 'holder', 'ivied', 'lacy', 'raisin', 'crumb', 'riches', 'creak', 'vamp', 'lotion', 'pantry', 'fibula', 'grief', 'family', 'skijor', 'lip', 'volume', 'manbag', 'silken', 'curt', 'based', 'smithy', 'mildew', 'soaked', 'lamely', 'humbly', 'topaz', 'kebab', 'diesel', 'funky', 'wpm', 'choosy', 'cursed', 'brad', 'obey', 'semi', 'willy', 'forgot', 'pursue', 'angst', 'artist', 'byword', 'creole', 'garish', 'teeter', 'suede', 'tubby', 'malady', 'glider', 'auteur', 'expose', 'testes', 'twat', 'innit', 'outta', 'harrow', 'jemmy', 'heroin', 'kidnap', 'bluish', 'wheat', 'skinny', 'arid', 'punish', 'gangly', 'chomp', 'nether', 'bout', 'twenty', 'sienna', 'pouty', 'wildly', 'gypsum', 'diaper', 'thorax', 'pander', 'enemy', 'resign', 'bored', 'lone', 'scorer', 'disco', 'topi', 'napalm', 'chute', 'layout', 'erupt', 'euro', 'jackal', 'halal', 'choppy', 'eyeful', 'viable', 'tamp', 'warren', 'synod', 'dreary', 'mesa', 'ripen', 'nickel', 'floral', 'swanky', 'chinos', 'ilk', 'sarong', 'offend', 'dunk', 'nature', 'niqab', 'undid', 'choral', 'punk', 'sublet', 'digit', 'sever', 'gorse', 'clever', 'titan', 'yacht', 'remold', 'ouzo', 'clumsy', 'docent', 'gamer', 'enzyme', 'frumpy', 'brat', 'adroit', 'unison', 'hyphen', 'recon', 'pedlar', 'mid', 'warmer', 'gassy', 'crotch', 'dogged', 'smooch', 'potato', 'lent', 'raring', 'loth', 'abo', 'gravel', 'cervix', 'terse', 'morale', 'waive', 'darned', 'selves', 'pinny', 'sturdy', 'peaky', 'salad', 'thrift', 'riven', 'fade', 'gaucho', 'learnt', 'dollar', 'tabby', 'snout', 'adore', 'enure', 'song', 'fallow', 'ochre', 'oblong', 'sheaf', 'propel', 'clingy', 'vigil', 'meekly', 'shelve', 'boar', 'obtain', 'heady', 'mensch', 'evens', 'gusty', 'howdah', 'octet', 'gruff', 'finder', 'tannin', 'passim', 'tartar', 'trauma', 'chose', 'foist', 'cutter', 'waiter', 'mohair', 'copter', 'lofty', 'myrtle', 'marsh', 'lager', 'width', 'bistro', 'gender', 'snit', 'cleave', 'each', 'donate', 'hove', 'mayest', 'shoddy', 'randy', 'fanboy', 'giving', 'stiffy', 'podium', 'thorn', 'cadre', 'minded', 'casino', 'petal', 'posit', 'locate', 'omen', 'ducat', 'twilit', 'dimly', 'scatty', 'choose', 'balmy', 'mourn', 'poppy', 'rut', 'oat', 'ignore', 'wispy', 'bleed', 'adhere', 'belfry', 'olive', 'vise', 'friar', 'clay', 'valley', 'maize', 'weir', 'grubby', 'valuer', 'burp', 'locale', 'crone', 'bush', 'sandal', 'squirm', 'barrio', 'drafty', 'zoo', 'macro', 'subset', 'nob', 'meany', 'solar', 'loiter', 'facade', 'topper', 'playa', 'renown', 'safely', 'zed', 'toecap', 'inhale', 'walker', 'rehab', 'from', 'impel', 'natty', 'frat', 'steno', 'dally', 'brunch', 'doggie', 'meanie', 'king', 'promo', 'cortex', 'fen', 'korma', 'nuance', 'pliant', 'knead', 'idly', 'fiver', 'bowwow', 'cudgel', 'josh', 'hydra', 'corona', 'condor', 'howdy', 'donor', 'stork', 'puffin', 'hooker', 'wretch', 'filmic', 'lech', 'bowel', 'monies', 'whir', 'pestle', 'rigor', 'nosily', 'futile', 'colony', 'yeasty', 'poach', 'mope', 'grid', 'feet', 'cinder', 'pinkie', 'runway', 'radon', 'unbend', 'mirth', 'heaven', 'elk', 'rajah', 'merry', 'fossil', 'linear', 'expo', 'every', 'raver', 'meal', 'teepee', 'placid', 'harry', 'shyly', 'flunk', 'ism', 'woke', 'van', 'domain', 'stag', 'shirt', 'bikini', 'bazaar', 'racoon', 'chivvy', 'juicer', 'unto', 'vase', 'center', 'phonic', 'lint', 'vole', 'recite', 'rabbi', 'kitty', 'gad', 'sentry', 'seldom', 'easily', 'glitzy', 'cherub', 'him', 'aplomb', 'overly', 'uptime', 'potion', 'coop', 'hoover', 'pueblo', 'lawman', 'prude', 'pitted', 'anus', 'fond', 'tawny', 'utopia', 'nice', 'pollen', 'corset', 'veined', 'hah', 'mommy', 'league', 'gigolo', 'opaque', 'jovial', 'mammon', 'hippie', 'bride', 'device', 'porker', 'glean', 'too', 'shoal', 'bald', 'city', 'byway', 'shimmy', 'spic', 'pillar', 'bijou', 'viably', 'pained', 'felon', 'speak', 'demure', 'skein', 'jargon', 'jinn', 'depict', 'shandy', 'shard', 'slimy', 'beige', 'maul', 'faux', 'dispel', 'carb', 'krona', 'unborn', 'botnet', 'severe', 'novice', 'river', 'dunno', 'dicey', 'coding', 'trad', 'hazing', 'oyster', 'assess', 'series', 'gambit', 'fave', 'belief', 'cyclic', 'sewn', 'honey', 'phobic', 'tarot', 'nearly', 'sill', 'finale', 'hazy', 'dinkum', 'hybrid', 'slutty', 'pious', 'horny', 'mantis', 'coward', 'dale', 'miser', 'whacky', 'knob', 'parson', 'font', 'rename', 'daze', 'typhus', 'who', 'flier', 'adjure', 'cleric', 'gaoler', 'origin', 'dovish', 'grad', 'doze', 'jeez', 'serge', 'pigpen', 'moped', 'whaler', 'bee', 'pathos', 'pippin', 'defrag', 'roadie', 'limpet', 'airing', 'dank', 'unmade', 'oilman', 'vexing', 'gungy', 'shaken', 'curacy', 'layman', 'bird', 'bovver', 'baccy', 'doc', 'clod', 'dairy', 'ken', 'effigy', 'oriole', 'fist', 'detect', 'cerise', 'gaff', 'stasis', 'sexton', 'avoid', 'gloat', 'raga', 'shucks', 'scamp', 'tundra', 'ignite', 'bilge', 'doodle', 'beget', 'girl', 'abrupt', 'topee', 'acidic', 'valued', 'colon', 'glen', 'sully', 'sashay', 'mace', 'gull', 'flab', 'blowsy', 'degree', 'roux', 'salsa', 'loco', 'craggy', 'notify', 'spacey', 'wormy', 'tum', 'amazed', 'haiku', 'mizzen', 'aleck', 'wanton', 'valour', 'weaken', 'shale', 'rootsy', 'impish', 'seraph', 'soviet', 'devil', 'beware', 'twiggy', 'stile', 'cobra', 'acacia', 'woven', 'ratbag', 'usurp', 'prance', 'cutie', 'bauble', 'richly', 'fervid', 'tawdry', 'pupate', 'picker', 'gene', 'vary', 'blazon', 'irate', 'enema', 'ranch', 'hairdo', 'gavel', 'godson', 'nudge', 'stung', 'quits', 'hajji', 'idiot', 'bakery', 'nifty', 'plover', 'winge', 'mousse', 'quiche', 'realm', 'proppy', 'warder', 'troika', 'has', 'encase', 'fencer', 'mingy', 'lunacy', 'tort', 'perish', 'stodge', 'rotund', 'douse', 'atomic', 'huh', 'liaise', 'demob', 'means', 'son', 'rug', 'heresy', 'dotty', 'behest', 'cornet', 'canyon', 'dual', 'lessen', 'twinge', 'would', 'snore', 'boon', 'nother', 'circa', 'penis', 'forger', 'oyez', 'agate', 'embody', 'whilst', 'toto', 'sassy', 'torso', 'durst', 'junket', 'dint', 'whine', 'titch', 'geyser', 'fitter', 'velvet', 'keeper', 'buster', 'oxide', 'locum', 'dazed', 'dreamt', 'balsam', 'toothy', 'amulet', 'callow', 'pounce', 'capped', 'hooded', 'gaiety', 'fondly', 'smock', 'papal', 'hero', 'mezzo', 'guava', 'timid', 'ludo', 'boohoo', 'sullen', 'fogey', 'drat', 'alum', 'wiki', 'pup', 'client', 'agism', 'shady', 'mutant', 'matted', 'hick', 'fiery', 'tbsp', 'catchy', 'rapids', 'canard', 'sexist', 'nimby', 'towbar', 'suburb', 'triad', 'grainy', 'rejig', 'liner', 'sequin', 'candy', 'endure', 'burgh', 'luge', 'iambic', 'ingot', 'dingy', 'tangy', 'garb', 'genera', 'peso', 'cheese', 'maggot', 'luxury', 'klutz', 'phial', 'czar', 'savor', 'pansy', 'rend', 'fatal', 'awaken', 'status', 'offing', 'sward', 'fjord', 'evade', 'earbud', 'lesser', 'codex', 'dated', 'extant', 'stool', 'shirty', 'mosey', 'vino', 'attend', 'kike', 'tartan', 'thicko', 'mod', 'odd', 'injure', 'bury', 'victor', 'radius', 'pewter', 'helix', 'gnu', 'unwrap', 'hutch', 'reckon', 'pecker', 'myrrh', 'combi', 'lilac', 'elope', 'liar', 'khaki', 'straw', 'wacko', 'thane', 'covet', 'hiding', 'curd', 'scarp', 'walnut', 'pubes', 'sappy', 'warped', 'hearty', 'pouch', 'mold', 'squib', 'dumbo', 'bitmap', 'uphold', 'prole', 'holy', 'siren', 'twerp', 'argot', 'lethal', 'orchid', 'plaque', 'adapt', 'beefy', 'cosmic', 'loch', 'idyll', 'douche', 'web', 'unruly', 'amid', 'render', 'youth', 'knives', 'okra', 'relaid', 'unit', 'spasm', 'bovine', 'fetish', 'trug', 'doe', 'monty', 'debt', 'skier', 'tights', 'liter', 'welder', 'samba', 'melon', 'nougat', 'piston', 'fruity', 'tremor', 'ion', 'locus', 'upland', 'pubic', 'mortar', 'noisy', 'era', 'trite', 'mutter', 'enable', 'leer', 'partly', 'aver', 'postal', 'bugler', 'hooked', 'tonne', 'stigma', 'stats', 'oldie', 'roust', 'comply', 'gosh', 'biopic', 'flee', 'tweed', 'pigmy', 'gave', 'vandal', 'grotty', 'nephew', 'mashed', 'molto', 'ticker', 'sicken', 'parser', 'bier', 'gabled', 'revere', 'holey', 'sauna', 'gooey', 'quoit', 'sorrel', 'mane', 'hotel', 'retell', 'alkali', 'prince', 'entice', 'mound', 'acuity', 'outer', 'deb', 'lackey', 'karat', 'larder', 'making', 'sulky', 'caplet', 'prank', 'vortex', 'com', 'inrush', 'genius', 'belle', 'serene', 'deface', 'blowzy', 'bra', 'wyvern', 'lentil', 'winery', 'lidded', 'modish', 'candid', 'pester', 'mosque', 'hiatus', 'busboy', 'tiddly', 'driver', 'celery', 'hopper', 'civic', 'romeo', 'shark', 'planet', 'weakly', 'imbibe', 'kingly', 'alpha', 'glocal', 'tenant', 'purvey', 'strong', 'labial', 'imp', 'slaw', 'doting', 'rowing', 'unrest', 'tall', 'garner', 'corny', 'flaw', 'openly', 'retire', 'famous', 'burka', 'rely', 'cress', 'lamp', 'swore', 'rocky', 'remiss', 'bade', 'balky', 'urban', 'stoke', 'brink', 'etch', 'bishop', 'nestle', 'carer', 'outlay', 'grew', 'meagre', 'sherd', 'twee', 'med', 'lucky', 'yuk', 'twisty', 'tit', 'midge', 'refer', 'thorny', 'beep', 'lest', 'uterus', 'butane', 'bedeck', 'elegy', 'resell', 'delude', ];

const htmlCache = {};

const acrossElements = document.getElementById('acrossElements'),
	highlightAPI = document.getElementById('highlight-api'),
	staticRanges = document.getElementById('staticRanges'),
	rangesWarning = document.getElementById('warning'),
	diacritics = document.getElementById('diacritics'),
	combineBy = document.getElementById('combineBy'),
	exclude = document.getElementById('exclude'),
	disable = document.getElementById('disable'),
	unmarkHighlight = document.getElementById('unmark-highlight'),
	markTable = document.getElementById('mark-table'),
	unmarkTable = document.getElementById('unmark-table'),
	markRegExpTable = document.getElementById('markRegExp-table'),
	markRangesTable = document.getElementById('markRanges-table');

let performanceData = {
	array:[[50, 100000, 5000], [100, 100000, 5000], [200, 100000, 5000]],
};

let longOperation = false;

acrossElements.addEventListener('click', function() {
	getOptions(performanceData.options.api);
});

diacritics.addEventListener('click', function() {
	getOptions(performanceData.options.api);
});

combineBy.addEventListener('change', function() {
	getOptions(performanceData.options.api);
});

exclude.addEventListener('change', function() {
	getOptions(performanceData.options.api);
});

disable.addEventListener('change', function() {
	checkExclude();
});

highlightAPI.addEventListener('click', function() {
	getOptions(performanceData.options.api);
	checkHighlightAPI();
});

staticRanges.addEventListener('click', function() {
	localStorage.setItem('staticRanges', staticRanges.checked);
	location.reload();
});

staticRanges.checked = localStorage.getItem('staticRanges') === 'true';    // Chrome
exclude.value = 'p.skip, p.skip *';

checkExclude();
getOptions('mark');
checkHighlightAPI();
mark();

function checkExclude() {
	exclude.disabled = !disable.checked;
	const skip = document.querySelector(exclude.value);
	if (skip) {
		skip.setAttribute("style", 'opacity:' + (exclude.disabled ? '0.5' : '1'));
	}
}

function checkHighlightAPI() {
	if ( !highlight) {
		highlightAPI.disabled = true;
		highlightAPI.nextElementSibling.setAttribute("style", 'opacity:0.5');
		unmarkHighlight.setAttribute("style", 'display:none');
	}

	longOperation = highlight && !staticRanges.checked;

	disableStaticRanges( !highlight || !highlightAPI.checked);
	unmarkHighlight.setAttribute("style", 'display:' + (highlight && highlightAPI.checked ? 'block' : 'none'));

	rangesWarning.textContent = !longOperation ? '' : 'This checkbox is added to demonstrate the performance problem you may encounter. Using Range objects instead of StaticRange causes a huge performance degradation when the library wraps matches in HTML elements after it runs using a Highlight API.';
}

function disableStaticRanges(disable) {
	staticRanges.disabled = disable;
	staticRanges.nextElementSibling.setAttribute("style", 'opacity: ' + (disable ? 0.5 : 1));
}

function getOptions(api) {
	const options = {
		api: api,
		highlightAPI: highlight && isChecked('highlight-api'),
		staticRanges: staticRanges.disabled ? true : useHighlightAPI(),
		diacritics: api === 'mark' && isChecked('diacritics'),
		acrossElements: isChecked('acrossElements'),
		combineBy: getNumericValue('combineBy', 10),
		//exclude: 'div.skip, div.skip *'
		exclude: exclude.value.trim()
	};
	performanceData.options = options;

	return performanceData.options;
}

// DOM 'onclick' event
function mark(button) {
	getOptions('mark');
	buildPerformanceTable(markTable);
}

// DOM 'onclick' event
function markRegExp(button) {
	getOptions('markRegExp');
	buildPerformanceTable(markRegExpTable);
}

// DOM 'onclick' event
function markRanges(button) {
	const opt = getOptions('markRanges');
	//opt.overlap = true;
	buildPerformanceTable(markRangesTable);
}

// DOM 'onclick' event
function unmark(button, useHighlight) {
	if (useHighlight) {
		useHighlight = isChecked('highlight-api');
	}
	buildUnmarkTable(unmarkTable, useHighlight);
}

function buildPerformanceTable(div) {
	checkExclude();

	const array = performanceData.array;
	const opt = performanceData.options;

	let table = getTableHeader(opt.api);

	for (let i = 0; i < array.length; i++) {
		const arr = array[i],
			obj = buildData(arr);

		const { count, time } = highlightWords(opt, null, obj);
		const length = opt.api === 'markRanges' ? count : arr[0];
		table += '<tr data-param=\'' + arr.toString() + '\'>';
		table += `<td>${time}</td><td></td><td>${length}</td><td>${count}</td><td>${getNumber(obj.htmlSize)}</td></tr>\n`;

		if (longOperation || opt.api === 'markRanges') break;
	}

	div.innerHTML = table + '</tbody></table>\n';

	const trs = div.querySelectorAll('tr[data-param]');

	addEventsToTable(div, trs);
	runHighlights(div, trs, performanceData.options);

	if ( !highlight || !performanceData.options.highlightAPI) {
		div.querySelectorAll('tr th:nth-child(2), tr td:nth-child(2)').forEach((elem) => {
			elem.remove();
		});
	}
}

function buildUnmarkTable(div, useHighlight) {
	const array = performanceData.array;
	const opt = performanceData.options;

	checkExclude();

	let table = '<table>\n<caption><b>' + opt.api + '() ➜ unmark()</b> ' + (useHighlightAPI() ? 'Highlight API' : '') + ' performance table</caption>\n<thead>';
	table += '<tr><th>Mark time</th><th>Unmark time</th><th>Array length</th><th>Matches</th><th>HTML length</th></tr>\n';
	table += '</thead>\n<tbody>';

	for (let i = 0; i < array.length; i++) {
		const arr = array[i],
			obj = buildData(arr, useHighlight);

		const { count, time } = highlightWords(opt, useHighlight ? highlight : null, obj);

		let time2 = performance.now();
		new Mark('#content').unmark({ 'exclude':!exclude.disabled && opt.exclude, });
		time2 = Math.trunc(performance.now() - time2);

		const length = opt.api === 'markRanges' ? count : arr[0];
		table += '<tr data-param=\'' + arr.toString() + '\'>';
		table += `<td>${time}</td><td>${time2}</td><td>${length}</td><td>${count}</td><td>${getNumber(obj.htmlSize)}</td></tr>\n`;

		if (longOperation || opt.api === 'markRanges') break;
	}

	div.innerHTML = table + '</tbody></table>\n';
}

function getNumber(num) {
	num = num / 1000;
	return num >= 1000 ? (num / 1000).toPrecision(2) + ' MB' : Math.trunc(num) + ' KB';
}

function useHighlightAPI() {
	//return highlight && (staticRanges.disabled || isChecked('staticRanges'));
	return highlight && (staticRanges.disabled || staticRanges.checked);
}

function isChecked(id) {
	return document.getElementById(id).checked;
}

function getNumericValue(id, defaultValue) {
	return parseInt(document.getElementById(id).value.trim()) || defaultValue;
}

function runHighlights(div, trs, opt) {
	if (opt.highlightAPI) {
		trs.forEach((elem) => {
			const data = elem.getAttribute('data-param').split(',').map((str) => Number(str)),
				obj = buildData(data, true);

			const { count, time } = highlightWords(opt, highlight, obj);
			elem.querySelector('td:nth-child(2)').textContent += ' ' + time;
			elem.querySelector('td:nth-child(4)').textContent = count;
		});
	}
}

function addEventsToTable(div, trs) {
	trs.forEach((elem) => {
		elem.addEventListener('click', runSingle);
	});

	div.querySelector('tbody').addEventListener('mousemove', (e) => {
		trs.forEach((elem) => { elem.className = ''; });
		let elem = e.target;
		elem = elem.tagName === 'TD' ? elem.parentNode : elem;
		elem.className = "light";
	});
}

function getTableHeader(api) {
	let table = '<table>\n<caption><b>' + api + '()</b> performance table</caption>\n<thead>';
	table += '<tr><th>Mark time</th><th>Highlight time</th><th>Array length</th><th>Matches</th><th>HTML length</th></tr>\n';
	table += '</thead>\n<tbody>';
	return table;
}

function runSingle(e) {
	const elem = e.target.tagName === 'TD' ? e.target.parentNode : e.target,
		data = elem.getAttribute('data-param').split(',').map((str) => Number(str)),
		opt = performanceData.options;

	let matchCount = 0,
		obj;

	obj = buildData(data, false);
	const { count, time } = highlightWords(opt, null, obj);
	elem.querySelector('td:nth-child(1)').textContent += ' ' + time;
	matchCount = count;

	if (opt.highlightAPI) {
		setTimeout(function() {
			obj = buildData(data, true);
			const { count, time } = highlightWords(opt, highlight, obj);
			elem.querySelector('td:nth-child(2)').textContent += ' ' + time;
		}, 100);
	}

	elem.querySelector('td:nth-child(4)').textContent = matchCount;
}

function createRange(startContainer, startOffset, endContainer, endOffset) {
	const range = new Range();
	range.setStart(startContainer, startOffset);
	range.setEnd(endContainer, endOffset);
	return range;
}

function highlightWords(opt, highlight, obj) {
	const { array, htmlSize, matches } = obj,
		selector = highlight ? '#highlight-content' : '#content';

	let matchCount = 0,
		time = 0;
	
	if (highlight) {
		CSS.highlights.delete('advanced-markjs');
		highlight.clear();
	}

	message(JSON.stringify(opt).replace(/^\{[^,]+,/, '{').replace(/"highlightAPI[^,]+(?:,|$)/, ''), true);

	let t1 = performance.now();
	const debug = isChecked('debug');
	const context = new Mark(selector);

	if (opt.api === 'mark') markWords();
	else if (opt.api === 'markRegExp') markRegExpWords();
	else if (opt.api === 'markRanges') markRanges();

	function markWords() {
		context.mark(array, {
			'diacritics': opt.diacritics,
			'separateWordSearch': false,
			'accuracy': 'exactly',

			'highlight': highlight,
			'staticRanges': opt.staticRanges,
			'acrossElements': opt.acrossElements,
			'combineBy': opt.combineBy,
			//'exclude': opt.exclude,
			done: finish,
			debug: debug
		});
	}

	function markRegExpWords() {
		const reg = new RegExp('\\b(?:' + array.join('|') + ')\\b', 'g');

		context.markRegExp(reg, {
			'highlight': highlight,
			'staticRanges': opt.staticRanges,
			'acrossElements': opt.acrossElements,
			done: finish,
			debug: debug
		});
	}

	function markRanges() {
		context.markRanges(array, {
			'highlight': highlight,
			'staticRanges': opt.staticRanges,
			'wrapAllRanges': true,
			done: finish,
			debug: debug
		});
	}

	function finish(total, totalMatches, termStats) {
		matchCount = totalMatches;
		time = Math.trunc(performance.now() - t1);
	}
	return { count: matchCount, time };
}

function buildData(array, useHighlight) {
	const opt = performanceData.options;
	const obj = getContent(opt, array);
	setHtmlContent(obj, useHighlight);
	return obj;
}

function getContent(opt, array) {
	let key = array.toString();

	if (opt.api === 'markRanges') key += ',' + opt.api;
	else if (opt.acrossElements) key += ',acrossElements';

	let obj = htmlCache[key];

	if ( !obj) {
		obj = generateContent(opt, array[0], array[1], array[2]);
		htmlCache[key] = obj;
	}

	return obj;
}

function setHtmlContent(obj, useHighlight) {
	const id = useHighlight ? 'highlight-content' : 'content',
		hideId = useHighlight ? 'content' : 'highlight-content';

	let article = document.getElementById(hideId);
	article.innerHTML = '';

	article = document.getElementById(id);
	article.innerHTML = '';

	const div = document.createElement('div');
	div.innerHTML = obj.html;
	article.appendChild(div);
}

// DOM 'onclick' event
function generate(elem, array, htmlSize, matches) {
	clearMessageBox();

	if (longOperation && htmlSize > 100000) {
		message('<b>Skipped because it can take a lot of time to process</b>');
		return;
	}

	if (highlight) {
		disableStaticRanges( !longOperation && htmlSize > 100000);
	}

	const result = [];

	array.forEach((num) => {
		const arr = [num, htmlSize, matches];
		buildData(arr, false);
		result.push(arr);
	});

	performanceData.array = result;
	getOptions('mark');

	elem.parentNode.querySelector('.selected').className = '';
	elem.className = 'selected';
}

function generateContent(opt, arraySize, htmlSize, matches) {
	let t1 = performance.now();

	const { htmlArray, wordArray } = buildHtmlContent(opt, arraySize, htmlSize, matches),
		html = htmlArray.join('');
	const array = opt.api === 'markRanges' ? buildRanges(matches, htmlSize, opt) : wordArray;

	let time = Math.trunc(performance.now() - t1);
	message('array = ' + arraySize + '; matches = ' + matches + '; html = ' + html.length + '; time = ' + time);

	return { array, html, htmlSize: html.length, matches };
}

function buildHtmlContent(opt, arraySize, htmlSize, matches) {
	const results = [],
		array = [];

	shuffle(words);

	const wordArray = words.slice(0, arraySize),
		wordsLength = wordArray.length,
		words2 = words.slice(arraySize);

	htmlSize -= (matches / arraySize) * wordArray.join('').length + htmlSize / 5;
	let length = 0;

	while (length < htmlSize) {
		shuffle(words2);
		let section = words2.slice(0, Math.floor((Math.random() * (words2.length - 1001)) + 1000));
		array.push(section);
		length += section.join('').length;
	}

	let offset = Math.floor(wordsLength / 4),
		start = 0;
	length = 0;

	while (length < matches) {
		const arr = wordArray.slice(start, start + offset),
			len = arr.length;

		for (let i = 0; i < array.length; i++) {
			if (length >= matches) break;

			if (length + len > matches) {
				array[i].push(...wordArray.slice(wordsLength - (matches - length)));
				length = Infinity;
				break;
			}

			array[i].push(...arr);
			length += len;
		}
		start = start + offset > wordsLength ? 0 : start + offset;
	}

	results.push('<h1>Randomly generated text</h1>\n');

	array.forEach((arr, index) => {
		shuffle(arr);

		let i = 0,
			start = 0,
			next = getNext(0);

		if (index === 0 && opt.exclude) {
			results.push('<p class="skip">');
			results.push(arr.slice(i, next).map((word, i) => {
				return opt.acrossElements && word.length > 5 && wordArray.includes(word) ? generateAcross(word) : word;
			}).join(' '));
			results.push('</p>\n');
			i = next;
			next = getNext(i);
		}

		results.push('<section>\n<p>');

		for (; i < arr.length; i++) {
			const word = arr[i];

			if (opt.acrossElements && word.length > 5 && i % 10 === 0) {
				arr[i] = generateAcross(word);
			}

			if (i > next) {
				results.push(arr.slice(start, i).join(' '), '</p>\n<p>');
				next = getNext(i);
				start = i;
			}
		}
		if (i < next) {
			results.push(arr.slice(start, i).join(' '));
		}
		results.push('</p>\n</section>\n');
	});

	return { htmlArray: results, wordArray };
}

function getNext(num) {
	return num + Math.floor((Math.random() * 150) + 50);
}

function generateAcross(word) {
	const index = Math.floor(word.length / 2);
	const num = Math.floor(Math.random() * 3) - 1;
	if (num > 0) {
		word = '<b>' + word.slice(0, index) + '</b>' + word.slice(index);

	} else if (num < 0) {
		word = word.slice(0, index) + '<b>' + word.slice(index) + '</b>';

	} else {
		word = word.slice(0, 2) + '<b>' + word.slice(2, 4) + '</b>' + word.slice(4);
	}
	return word;
}

function shuffle(array) {
	let i = array.length;

	while (--i > 1) {
		let n = Math.floor((Math.random() * i) + 1);
		let temp = array[i];
		array[i] = array[n];
		array[n] = temp;
	}
	return array;
}

function buildRanges(length, htmlSize, opt) {
	const array = [];

	if (opt.overlap) {
		for (let i = 0; i < length; i++) {
			let length = Math.floor((Math.random() * 45) + 1);
			let start = Math.floor((Math.random() * (htmlSize - length)) + 1);
			array.push({ start: start, length: length });
		}

	} else {
		//const step = Math.max(htmlSize / length, 45) - 5;
		const step = htmlSize / length - 5;
		let prevStart = 0;

		for (let i = 0; i < length; i++) {
			let length = Math.floor((Math.random() * 15) + 5);
			let start = prevStart + Math.floor((Math.random() * (step + 5)) + 1);
			array.push({ start: start, length: length });
			prevStart = start + length;
		}
	}

	return array;
}

function clearMessageBox() {
	const logBox = document.getElementById('message-box');
	logBox.innerHTML = '';
}

function message(str, clear) {
	const logBox = document.getElementById('message-box');
	if (clear) logBox.innerHTML = '';
	logBox.innerHTML += str + '\n';
}

