
'use strict';

let debug = true,
	warning = 'This browser does not supported CSS Custom Highlight API.',
	highlight;

if (typeof Highlight !== 'undefined') {
	highlight = new Highlight();

} else {
	//log(warning);
}
// 2000 words
var words = [
 'abbreviate', 'abet', 'ably', 'aborigine', 'about', 'abreast', 'absent', 'absorbing', 'absurdly', 'academically', 'acceptable', 'accidentally', 'according', 'accredited', 'accuser', 'achiever', 'acorn', 'acquit', 'across', 'activist', 'acute', 'add', 'adept', 'adjacent', 'adjust', 'admiration', 'admonish', 'adoration', 'adulterate', 'adventure', 'advocate', 'aesthetics', 'affectionate', 'affirmatively', 'afraid', 'after', 'aftershock', 'agenda', 'aggressiveness', 'agitator', 'agreeable', 'aide', 'air', 'aircraft', 'airport', 'alarm', 'alcoholic', 'algebra', 'alignment', 'all', 'allege', 'alley', 'allowance', 'almond', 'alphabet', 'also', 'altercation', 'altruism', 'amass', 'amber', 'ambivalent', 'amends', 'amid', 'amok', 'amphibian', 'amputee', 'an', 'analogous', 'anatomy', 'and', 'anecdotal', 'angel', 'angry', 'ankle', 'announcer', 'anoint', 'answering', 'ante', 'anthropology', 'antifreeze', 'antitrust', 'anyhow', 'apartment', 'aplomb', 'apostle', 'apparition', 'appendicitis', 'appliance', 'appointment', 'apprehension', 'appropriation', 'apricot', 'aqueduct', 'arc', 'architect', 'ardor', 'are', 'argumentative', 'arm', 'armored', 'around', 'arousal', 'arrive', 'arterial', 'artificial', 'artwork', 'as', 'asexual', 'ask', 'aspiration', 'assed', 'assertiveness', 'assistance', 'assumption', 'astonished', 'astrological', 'at', 'ate', 'atmospheric', 'attachment', 'attention', 'attractive', 'auctioneer', 'auditor', 'austere', 'authoritative', 'autocracy', 'autonomous', 'available', 'aversion', 'avow', 'awash', 'awning', 'baa', 'backbone', 'backlash', 'backwards', 'badly', 'bagpipes', 'balcony', 'ballistic', 'baloney', 'bandanna', 'banister', 'banter', 'barbed', 'barge', 'barracks', 'barter', 'basics', 'bat', 'battalion', 'bay', 'be', 'beak', 'beast', 'bebop', 'because', 'become', 'bedlam', 'beef', 'been', 'beetle', 'began', 'behaved', 'belch', 'belly', 'benchmark', 'benevolent', 'berry', 'best', 'bestow', 'beware', 'Bible', 'bidding', 'bigmouth', 'bile', 'billow', 'bingo', 'biopsy', 'birthmark', 'bitch', 'blab', 'blacklist', 'blame', 'blase', 'bleach', 'blemish', 'blind', 'blistering', 'blockage', 'bloodshot', 'blotch', 'bludgeon', 'blunder', 'blusher', 'boast', 'body', 'bohemian', 'bolster', 'bond', 'boo', 'bookkeeper', 'boomerang', 'bootleg', 'bored', 'bossily', 'bottle', 'bounce', 'bourbon', 'bowlegged', 'boyfriend', 'bracket', 'brains', 'brandish', 'bravery', 'bread', 'breakneck', 'breathing', 'breezy', 'bricklayer', 'briefing', 'brilliantly', 'britches', 'broccoli', 'bronchitis', 'brother', 'Brownies', 'brush', 'bubbly', 'buddy', 'bugle', 'bulk', 'bullfighter', 'bump', 'bungler', 'burden', 'burlap', 'burst', 'businesslike', 'but', 'buttermilk', 'buzz', 'by', 'cafe', 'calamity', 'caliber', 'callously', 'came', 'campaigner', 'can', 'cancel', 'candlestick', 'cannibal', 'cantankerous', 'capacity', 'captain', 'carat', 'cardigan', 'carefulness', 'caring', 'carol', 'carrier', 'carton', 'caseworker', 'cassette', 'castrate', 'catalyst', 'catechism', 'cathedral', 'caucus', 'cavalry', 'ceaselessly', 'celibacy', 'Celsius', 'center', 'certainty', 'cesspool', 'chalet', 'champ', 'channel', 'chapter', 'charge', 'charmer', 'chasten', 'chauffeur', 'cheater', 'checkmate', 'cheerfulness', 'chemical', 'chest', 'chide', 'childhood', 'chilly', 'chinos', 'chivalrous', 'choir', 'chopsticks', 'chosen', 'chromium', 'chuck', 'churlish', 'cinema', 'circulate', 'circumvention', 'city', 'clack', 'clamp', 'clarify', 'classification', 'claustrophobic', 'cleanser', 'cleft', 'cleverly', 'climatic', 'clinician', 'clobber', 'closeness', 'clothespin', 'club', 'clung', 'coagulation', 'coastal', 'cobweb', 'cocoa', 'coexist', 'cohabit', 'coincidental', 'coldness', 'collarbone', 'collector', 'cologne', 'colorblind', 'comatose', 'come', 'comforter', 'commandeer', 'commend', 'commercially', 'commodore', 'communication', 'commuter', 'compare', 'compatriot', 'competition', 'complaint', 'compliant', 'compose', 'comprehension', 'computation', 'computer', 'concealment', 'concentric', 'concession', 'conclusion', 'concurrent', 'condiment', 'condom', 'confederate', 'confide', 'confines', 'confound', 'congested', 'congressional', 'conjunction', 'conquer', 'consecration', 'conservatism', 'considerately', 'console', 'conspiracy', 'constituency', 'constrictor', 'consultant', 'contagious', 'contempt', 'contentment', 'continual', 'contortion', 'contradiction', 'contributor', 'controversy', 'conventional', 'convertible', 'convivial', 'cooking', 'coordinate', 'copulate', 'cordon', 'cornerstone', 'corporal', 'correction', 'correspondingly', 'corruption', 'costly', 'could', 'countenance', 'countersign', 'courage', 'courthouse', 'coveralls', 'cowardice', 'crab', 'craftily', 'cranberry', 'crass', 'crazed', 'creation', 'credibly', 'cremation', 'crevasse', 'cringe', 'crispy', 'critter', 'crooked', 'crossing', 'crowd', 'cruddy', 'crummy', 'crustacean', 'crystal', 'cuddle', 'culpability', 'cultured', 'curb', 'curler', 'cursed', 'cushion', 'customize', 'cutoff', 'cyclone', 'czar', 'dainty', 'damn', 'dancing', 'dapper', 'darned', 'daughter', 'day', 'daydreamer', 'deaconess', 'deafness', 'dearth', 'debilitating', 'debunk', 'decanter', 'decide', 'deck', 'decoration', 'decry', 'deep', 'defeat', 'defender', 'defiant', 'definition', 'deformed', 'degeneration', 'deja', 'deletion', 'delight', 'deliver', 'demagogue', 'demo', 'demonic', 'den', 'dent', 'department', 'deplete', 'deposit', 'deprivation', 'derelict', 'describe', 'deserve', 'desirous', 'despicable', 'destiny', 'detail', 'detergent', 'detonate', 'devastate', 'deviate', 'devotedly', 'diabetic', 'dialect', 'dice', 'dictionary', 'different', 'differentiate', 'digit', 'dilate', 'dimension', 'ding', 'diphtheria', 'direct', 'disability', 'disappear', 'disapprovingly', 'disband', 'disciplinarian', 'discoloration', 'discontinue', 'discourtesy', 'discriminate', 'disembark', 'disgrace', 'disheartening', 'disillusion', 'disjointed', 'dismally', 'disobey', 'disparage', 'dispensation', 'displeasure', 'disqualification', 'disruption', 'dissenter', 'dissociation', 'distend', 'distinguish', 'distress', 'disturbance', 'diverge', 'divide', 'divisive', 'do', 'dock', 'does', 'dogmatic', 'dolphin', 'dominate', 'dong', 'door', 'dorky', 'doting', 'doughnut', 'downgrade', 'downstate', 'dowry', 'drafty', 'dramatics', 'draw', 'dreadfully', 'dress', 'drier', 'drivel', 'drooping', 'drowsily', 'drunkard', 'dubious', 'dues', 'dumbbell', 'dungeon', 'duration', 'during', 'duty', 'dye', 'dysentery', 'ear', 'earnestly', 'earthiness', 'east', 'easygoing', 'ebullience', 'ecologist', 'ecstasy', 'edification', 'educational', 'effects', 'effortlessly', 'eggshell', 'eighteenth', 'elaborate', 'elder', 'electrical', 'electronic', 'elements', 'eligibility', 'elongate', 'elude', 'embargo', 'embellish', 'embodiment', 'emcee', 'emigration', 'emotional', 'emphatically', 'empower', 'encase', 'encounter', 'endangered', 'endlessly', 'energetic', 'engaged', 'engrossed', 'enlarge', 'enormous', 'ensemble', 'enter', 'enthusiasm', 'entitle', 'entrap', 'entwine', 'environmental', 'ephemeral', 'episode', 'equalize', 'equine', 'era', 'erotically', 'erudite', 'escapism', 'especially', 'estate', 'estrogen', 'ethic', 'euphemism', 'evacuee', 'evasive', 'even', 'eventful', 'everyday', 'evil', 'exactly', 'example', 'excellence', 'excessive', 'exciting', 'excrement', 'executioner', 'exertion', 'exhibitionism', 'exile', 'exorcist', 'expectancy', 'expendable', 'experimentally', 'expletive', 'explorer', 'exposition', 'expulsion', 'exterior', 'extort', 'extraordinarily', 'extremist', 'exultant', 'eyeliner', 'face', 'facility', 'fag', 'fairy', 'fallacious', 'falsity', 'family', 'fanciful', 'farming', 'fascist', 'fat', 'Father', 'faucet', 'favoritism', 'fearlessness', 'fecal', 'fee', 'feet', 'felt', 'fender', 'ferry', 'fester', 'fetid', 'feverishly', 'fiberglass', 'fidget', 'fifteen', 'figurative', 'fill', 'film', 'fin', 'finances', 'finely', 'fir', 'fireside', 'firstly', 'fission', 'fixation', 'flaccid', 'flak', 'flammable', 'flashlight', 'flatulence', 'fleck', 'flew', 'flimsy', 'flit', 'flooring', 'flotilla', 'flowerpot', 'fluently', 'fluorescent', 'flux', 'fodder', 'fold', 'following', 'fool', 'footbridge', 'footprint', 'for', 'forbearance', 'forceps', 'foreclose', 'foremost', 'foreskin', 'foreword', 'forgive', 'forklift', 'form', 'formative', 'fornicate', 'forth', 'fortunately', 'foster', 'fourteen', 'foyer', 'fragrance', 'frankly', 'fraudulently', 'freelance', 'freezer', 'frequently', 'Fri', 'friendship', 'frigid', 'frivolity', 'from', 'front', 'frosty', 'fruitcake', 'frustrating', 'fugitive', 'fumes', 'fundamentalist', 'funky', 'furnace', 'furthest', 'futilely', 'gaffe', 'galaxy', 'gallon', 'game', 'gangster', 'garden', 'garnet', 'gasoline', 'gathering', 'gawky', 'generalized', 'generously', 'genius', 'gently', 'geography', 'germ', 'get', 'ghostwriter', 'gig', 'gingerbread', 'gist', 'gladiator', 'glaring', 'glee', 'glint', 'global', 'glorification', 'glow', 'glut', 'gnawing', 'gob', 'goddamn', 'godsend', 'golly', 'good', 'goodies', 'gospel', 'gout', 'graceful', 'gradient', 'grammar', 'grandfather', 'granny', 'graph', 'grasshopper', 'grating', 'gravitate', 'Great', 'greenhorn', 'grew', 'grill', 'gringo', 'groan', 'groovy', 'grouse', 'grubby', 'grunge', 'guardedly', 'guffaw', 'guillotine', 'gull', 'gumption', 'gunpowder', 'gust', 'guzzler', 'gyrate', 'hack', 'hail', 'hairsplitting', 'halibut', 'hallway', 'hammer', 'handcuffs', 'handlebar', 'handwriting', 'hangover', 'happening', 'hardcover', 'harebrained', 'harmonious', 'harrowing', 'has', 'hassle', 'hated', 'have', 'hazel', 'headhunter', 'headquarters', 'healer', 'hearsay', 'hearten', 'heat', 'heaviness', 'hedonist', 'heighten', 'helium', 'helping', 'hemophilia', 'her', 'hereditary', 'hernia', 'hers', 'hew', 'hiccups', 'hideout', 'highlighter', 'hilarious', 'himself', 'hinterland', 'historian', 'hitchhiker', 'hoarder', 'hockey', 'holdup', 'holocaust', 'homeless', 'homesick', 'homogeneous', 'honesty', 'honored', 'hoop', 'hopeless', 'hornet', 'horrifying', 'horticulture', 'hostel', 'hotheaded', 'houseboat', 'housewives', 'how', 'hrs', 'huge', 'humanism', 'humbling', 'humility', 'hundredth', 'hurdle', 'hurtful', 'hut', 'hygiene', 'hypersensitive', 'hypnotist', 'hypotheses', 'iceberg', 'ideal', 'identity', 'idiotically', 'if', 'igloo', 'illegible', 'illuminate', 'image', 'imbecile', 'immature', 'immigrant', 'immorally', 'imp', 'impassable', 'impeccably', 'imperfectly', 'impertinent', 'implement', 'impolitely', 'impossibility', 'impregnable', 'improbability', 'improvise', 'in', 'inability', 'inadequately', 'inasmuch', 'Inc', 'incarnate', 'inch', 'incisor', 'incognito', 'incompetent', 'inconsequential', 'inconvenience', 'increased', 'incriminating', 'indebtedness', 'indefinably', 'Independence', 'indication', 'indigent', 'indiscreet', 'individualism', 'indomitable', 'industrial', 'inefficiency', 'inert', 'inexpensive', 'infancy', 'inference', 'infidelity', 'infinity', 'inflate', 'infliction', 'informally', 'infrequently', 'ingenuity', 'inhale', 'inhumane', 'injunction', 'inlet', 'innocent', 'inoculation', 'inquiring', 'inscribe', 'insensitivity', 'insistence', 'insomniac', 'install', 'instigate', 'instruction', 'insufferable', 'insurance', 'integer', 'intensively', 'interactive', 'interference', 'internally', 'interpose', 'interruption', 'interviewer', 'intimidate', 'into', 'intoxicated', 'intricate', 'introvert', 'inundate', 'invasive', 'investigate', 'invisibility', 'involve', 'irascible', 'ironing', 'irritable', 'is', 'islander', 'it', 'italicize', 'its', 'itself', 'jackhammer', 'jailer', 'January', 'jaw', 'Jeep', 'jerky', 'jeweled', 'jilt', 'joblessness', 'john', 'jolt', 'joyful', 'jubilation', 'jug', 'jumbled', 'June', 'jurisdiction', 'just', 'justly', 'karma', 'keg', 'keynote', 'kidnap', 'kilogram', 'kindle', 'kingpin', 'kitty', 'knee', 'knitting', 'knotty', 'koala', 'labor', 'lack', 'lady', 'lame', 'landing', 'languid', 'lard', 'lash', 'lateral', 'laudable', 'laurel', 'lawn', 'layman', 'leading', 'leaning', 'learn', 'leather', 'ledger', 'legal', 'legible', 'legitimate', 'lengthwise', 'leopard', 'lesson', 'letup', 'levy', 'libel', 'liberty', 'licking', 'life', 'lifeless', 'light', 'lightweight', 'like', 'lilt', 'limitations', 'linear', 'linguist', 'lip', 'listen', 'literal', 'litterbug', 'liven', 'loads', 'lobby', 'location', 'lofty', 'logo', 'long', 'lookalike', 'loosen', 'loser', 'loudmouthed', 'lover', 'lowly', 'lucidity', 'lugubrious', 'lump', 'lunge', 'lustrous', 'lynching', 'machine', 'maddening', 'magenta', 'magnate', 'magnify', 'mailing', 'maintenance', 'make', 'makeup', 'malicious', 'malpractice', 'management', 'mange', 'mania', 'manipulate', 'mannerism', 'mantra', 'many', 'map', 'mare', 'market', 'marmalade', 'marshal', 'marvelous', 'masking', 'massacre', 'mastermind', 'matchmaker', 'maternal', 'matriarchy', 'mattress', 'maxim', 'may', 'mayor', 'meaning', 'measurable', 'meat', 'mechanic', 'medallion', 'medical', 'meditate', 'meetinghouse', 'mellow', 'member', 'menial', 'menthol', 'merciless', 'meringue', 'messenger', 'metallurgy', 'meteoric', 'methodically', 'mettle', 'microfilm', 'migrant', 'mileage', 'milk', 'milliner', 'mincemeat', 'mineral', 'miniskirt', 'mint', 'mire', 'misinform', 'mismatch', 'misread', 'misspell', 'mistook', 'misuse', 'mixer', 'mobilize', 'moderate', 'modesty', 'moist', 'molecular', 'moment', 'monastery', 'mono', 'monoxide', 'moo', 'moonlit', 'moralist', 'more', 'mores', 'mortal', 'mortis', 'most', 'motel', 'motif', 'motorboat', 'mount', 'mourner', 'mouthpiece', 'mow', 'mud', 'muffler', 'multicultural', 'mumble', 'munitions', 'museum', 'must', 'mutability', 'mutinous', 'myriad', 'mystique', 'naive', 'napalm', 'narration', 'nastiness', 'nationalize', 'naturalize', 'nausea', 'navigation', 'neatly', 'nectar', 'needy', 'negligence', 'neighbor', 'nerdy', 'nettle', 'neutrality', 'new', 'newfangled', 'newsprint', 'nicely', 'night', 'nights', 'ninety', 'no', 'nobility', 'noiseless', 'nonstandard', 'nope', 'northward', 'nostalgic', 'not', 'note', 'notification', 'nourishment', 'now', 'noxious', 'nugget', 'number', 'numerous', 'nutmeg', 'nylons', 'oath', 'object', 'obligatory', 'oblong', 'observant', 'obstructive', 'occult', 'Ocean', 'odd', 'oeuvre', 'of', 'offhand', 'offshore', 'oils', 'olive', 'on', 'one', 'onion', 'only', 'oodles', 'opera', 'opportunistic', 'oppressor', 'option', 'or', 'oration', 'orchid', 'ore', 'organizer', 'original', 'ornithology', 'ostentatious', 'other', 'ounce', 'our', 'out', 'outboard', 'outdistance', 'outgoing', 'outlay', 'outperform', 'outreach', 'oxidize', 'pacifist', 'pad', 'painkiller', 'paints', 'palsy', 'panda', 'panic', 'pantomime', 'paperback', 'parachute', 'parakeet', 'paramount', 'parcel', 'parenthesis', 'partial', 'particulars', 'party', 'passerby', 'password', 'pastoral', 'patently', 'pathologist', 'patriarchy', 'patron', 'paunch', 'payable', 'Peace', 'peacock', 'pebble', 'pedantically', 'pee', 'peg', 'penalty', 'penguin', 'penniless', 'people', 'pep', 'perceptible', 'perennial', 'perfunctorily', 'peripheral', 'perm', 'pernicious', 'perplexing', 'perversely', 'pest', 'petroleum', 'phenomenon', 'phony', 'photograph', 'physician', 'pick', 'pictorial', 'pierce', 'pigment', 'pimple', 'ping', 'pinup', 'pique', 'piston', 'pitifully', 'place', 'plague', 'planet', 'planter', 'plateful', 'playboy', 'playpen', 'please', 'plentiful', 'plodding', 'plumber', 'plurality', 'pneumonia', 'pod', 'poignancy', 'pointlessness', 'polar', 'policeman', 'political', 'polling', 'polygamist', 'pompom', 'pontoon', 'poorly', 'popularize', 'porn', 'portent', 'Portuguese', 'possessions', 'postdate', 'postmark', 'pot', 'pothole', 'pound', 'powered', 'practicality', 'praiseworthy', 'preamble', 'precinct', 'precocious', 'premium', 'prepared', 'presage', 'presentation', 'presumably', 'pretext', 'prevention', 'prick', 'primal', 'primp', 'principles', 'prisoner', 'privileged', 'probing', 'procession', 'prod', 'productivity', 'programming', 'project', 'prolong', 'promising', 'prone', 'prop', 'properly', 'proportions', 'proscription', 'prospectus', 'protect', 'proton', 'proverb', 'provisional', 'prowler', 'prurient', 'psychiatry', 'pubescence', 'publishing', 'pugnacious', 'pulsation', 'pun', 'punish', 'puppet', 'purification', 'purposeful', 'pus', 'putt', 'python', 'quail', 'quandary', 'quarry', 'quaver', 'question', 'quid', 'quip', 'quizzical', 'rabble', 'racist', 'radiate', 'radiology', 'ragamuffin', 'railing', 'rainy', 'rambling', 'rancher', 'ranging', 'rapid', 'rare', 'rata', 'rationale', 'raucously', 'ray', 'reactor', 'ready', 'realm', 'rearview', 'rebate', 'rebut', 'receive', 'recession', 'recklessly', 'recognizable', 'reconciliation', 'recount', 'recruitment', 'recurrence', 'redeem', 'redneck', 'redundant', 'reenact', 'refinance', 'reflex', 'refreshingly', 'refundable', 'regarding', 'regiment', 'registry', 'regularity', 'rehearsal', 'reinforcement', 'rejoice', 'relation', 'relay', 'reliably', 'relinquish', 'remainder', 'remedy', 'remit', 'removable', 'render', 'renovate', 'rep', 'repeat', 'repetition', 'replete', 'reprehensible', 'reprieve', 'reptile', 'repulsion', 'requirement', 'resemblance', 'reservoir', 'resignation', 'resolution', 'resourceful', 'respecting', 'response', 'restitution', 'restricted', 'resurgence', 'retainer', 'rethink', 'retiring', 'retribution', 'reunite', 'reveler', 'reverently', 'revise', 'revolutionary', 'rework', 'rhinestone', 'ribald', 'rid', 'ridiculously', 'righteousness', 'rigor', 'ringside', 'RIP', 'rite', 'rivet', 'roadworthy', 'robot', 'rodent', 'rolling', 'roofing', 'root', 'rot', 'rotunda', 'roundabout', 'row', 'rub', 'rudder', 'rug', 'ruminate', 'rundown', 'rush', 'ruthlessly', 'sack', 'sadden', 'safeguard', 'sail', 'salaried', 'salivate', 'salutation', 'sanatorium', 'sandblast', 'sanitation', 'sarcastically', 'Satan', 'satirize', 'Saturn', 'savage', 'savory', 'scads', 'scalper', 'scanner', 'scarf', 'scenario', 'schizophrenia', 'scholarship', 'science', 'scoop', 'scorn', 'scourge', 'scrap', 'screech', 'scrimp', 'scrupulously', 'scurry', 'searching', 'seasoned', 'secluded', 'secretary', 'secular', 'sedentary', 'see', 'Seeing', 'seethe', 'selection', 'selling', 'semiconductor', 'senate', 'seniority', 'sensitive', 'sentiment', 'September', 'sergeant', 'serum', 'servitude', 'setup', 'severe', 'sexist', 'shade', 'shaken', 'shameful', 'share', 'shave', 'sheaves', 'shell', 'sheriff', 'shinny', 'shirtsleeve', 'shoddy', 'shopkeeper', 'shortchange', 'shortsighted', 'show', 'showroom', 'shrine', 'shrunken', 'shuteye', 'sicken', 'sidelines', 'siesta', 'sightseeing', 'signing', 'silk', 'silverware', 'simplify', 'since', 'sincere', 'single', 'sip', 'sisterly', 'sixteen', 'skateboarder', 'sketch', 'skilled', 'skinned', 'skull', 'slab', 'slang', 'slaughterhouse', 'sleep', 'sleeve', 'slid', 'slink', 'slobber', 'sloth', 'slug', 'slush', 'smarty', 'smith', 'smoking', 'smug', 'snag', 'sneak', 'sniffles', 'snoop', 'snow', 'snowplow', 'so', 'soaked', 'soccer', 'sodium', 'soggy', 'solely', 'solidity', 'solvable', 'some', 'someplace', 'song', 'sophisticated', 'sorcery', 'sort', 'soundproof', 'southbound', 'spa', 'spades', 'spare', 'Spartan', 'speak', 'specially', 'speck', 'speculate', 'speeding', 'spendthrift', 'spider', 'spineless', 'spit', 'splendor', 'spoke', 'sporting', 'spotty', 'spreadsheet', 'sprinter', 'spurn', 'squander', 'squeamish', 'stabbing', 'staffing', 'stagnation', 'stakeout', 'stamina', 'standby', 'star', 'Stars', 'stat', 'static', 'stature', 'steal', 'steep', 'stenographer', 'stepping', 'sterling', 'stickler', 'stigmatize', 'stimulating', 'stint', 'stockbroker', 'stoke', 'stonewall', 'stopper', 'stormy', 'straighten', 'strangely', 'strategic', 'streaky', 'strengthen', 'strewn', 'striking', 'striptease', 'strove', 'stubborn', 'studious', 'stung', 'stupidly', 'suave', 'subject', 'submerged', 'subscription', 'subsist', 'subterranean', 'subversive', 'successor', 'such', 'sudden', 'sufficiency', 'suggestible', 'suitcase', 'sum', 'sun', 'sundown', 'sunrise', 'superficial', 'supernatural', 'supervisor', 'supply', 'suppress', 'surf', 'surly', 'surrealistic', 'survive', 'suspiciously', 'swap', 'sweats', 'sweetener', 'swerve', 'swing', 'swoon', 'syllabi', 'symmetry', 'sync', 'synopses', 'syringe', 'system', 'tablecloth', 'taciturn', 'tactical', 'tailor', 'takeoff', 'talker', 'tamper', 'tango', 'tantrum', 'tardiness', 'tart', 'tasty', 'tavern', 'tbsp', 'teamster', 'teat', 'teddy', 'teeny', 'telegraph', 'teller', 'tempered', 'tempting', 'tenderize', 'tension', 'tequila', 'Terr', 'terrify', 'test', 'tether', 'than', 'thanks', 'that', 'the', 'their', 'theirs', 'them', 'theoretically', 'there', 'thereabouts', 'Thermos', 'these', 'they', 'thicket', 'things', 'thirteen', 'this', 'thoughtless', 'threaten', 'thrill', 'throng', 'through', 'thud', 'thunderstruck', 'tickle', 'tiff', 'tile', 'time', 'timetable', 'tinged', 'tipsy', 'tit', 'to', 'toaster', 'toehold', 'toilet', 'tollbooth', 'tonsil', 'toothpaste', 'topsy', 'torrid', 'total', 'touchdown', 'tourism', 'tower', 'trace', 'tradition', 'trailer', 'trample', 'transcend', 'transformation', 'transitive', 'transparency', 'trap', 'traveler', 'treadmill', 'treble', 'trenchant', 'triangular', 'trickle', 'trill', 'tripe', 'trivial', 'troops', 'troubleshooter', 'truce', 'truly', 'trustee', 'tsp', 'Tuesday', 'tumor', 'turbine', 'turnaround', 'turquoise', 'tutoring', 'twentieth', 'twinkle', 'tyke', 'typically', 'ubiquity', 'ultimatum', 'uncertain', 'unclean', 'uncouth', 'uneven', 'unfounded', 'unheard', 'unify', 'unionize', 'universal', 'unknowingly', 'unload', 'unnatural', 'unofficially', 'unreliable', 'unsanitary', 'unsettled', 'unstable', 'untenable', 'untoward', 'unwelcome', 'unzip', 'up', 'upheld', 'upper', 'upset', 'uptake', 'urchin', 'use', 'used', 'usual', 'usually', 'utopia', 'vacationer', 'vaguely', 'valid', 'vampire', 'vanity', 'variety', 'vat', 'veggies', 'velour', 'venetian', 'verbose', 'versatility', 'very', 'vex', 'vicarious', 'victory', 'vigilance', 'villager', 'vinyl', 'virtue', 'vise', 'vista', 'vivacity', 'vociferously', 'volition', 'voluptuous', 'vouch', 'vulnerability', 'wag', 'wait', 'walkie', 'walnut', 'want', 'ware', 'warmed', 'warrant', 'was', 'wash', 'wasn', 'watchful', 'watering', 'watery', 'wealth', 'weasel', 'wedlock', 'weep', 'welcome', 'wept', 'westerner', 'whaling', 'what', 'wheelbarrow', 'when', 'whereby', 'which', 'whiff', 'whipping', 'whistle', 'who', 'whoever', 'whoops', 'wicker', 'width', 'wildly', 'will', 'willpower', 'windchill', 'windsurf', 'wingtip', 'wipe', 'wisely', 'wistfully', 'with', 'withheld', 'witticism', 'wok', 'won', 'wooly', 'work', 'workbook', 'worldwide', 'wove', 'wreath', 'wretched', 'writer', 'wrote', 'yearning', 'yes', 'yoke', 'you', 'your', 'yourself', 'zigzag', 'zoo'];

const htmlCache = {};

const acrossElements = document.getElementById('acrossElements'),
	highlightAPI = document.getElementById('highlight-api'),
	staticRanges = document.getElementById('staticRanges'),
	rangesWarning = document.getElementById('warning'),
	diacritics = document.getElementById('diacritics'),
	combineBy = document.getElementById('combineBy'),
	exclude = document.getElementById('exclude'),
	enableExclude = document.getElementById('enable-exclude'),
	matchesCount = document.getElementById('matches'),
	customMatches = document.getElementById('custom-matches'),
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

/*exclude.addEventListener('change', function() {
	getOptions(performanceData.options.api);
});*/

customMatches.addEventListener('click', function() {
	checkVisibility();
});

enableExclude.addEventListener('change', function() {
	checkVisibility();
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

checkVisibility();
getOptions('mark');
checkHighlightAPI();
mark();

function checkVisibility() {
	matchesCount.disabled = !customMatches.checked;
	matchesCount.previousElementSibling.setAttribute("style", 'opacity:' + (matchesCount.disabled ? '0.5' : '1'));

	exclude.disabled = !enableExclude.checked;
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
		//exclude: exclude.value.trim()
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
	checkVisibility();

	const array = performanceData.array;
	const opt = performanceData.options;

	let table = getTableHeader(opt.api);

	for (let i = 0; i < array.length; i++) {
		const arr = array[i],
			obj = buildData(array[i]);

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

	checkVisibility();

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
		nth = 3,
		obj;

	obj = buildData(data, false);
	const { count, time } = highlightWords(opt, null, obj);
	elem.querySelector('td:nth-child(1)').textContent += ' ' + time;
	matchCount = count;

	if (opt.highlightAPI) {
		nth = 4;
		setTimeout(function() {
			obj = buildData(data, true);
			const { count, time } = highlightWords(opt, highlight, obj);
			elem.querySelector('td:nth-child(2)').textContent += ' ' + time;
		}, 100);
	}

	elem.querySelector('td:nth-child(' + nth + ')').textContent = matchCount;
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

// DOM 'onclick' event
function generate(elem, array, htmlSize, matches) {
	clearMessageBox();

	if (customMatches.checked) {
		matches = getCustomMatches(matches);
	}

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
		buildData(arr, false, true);
		result.push(arr);
	});

	performanceData.array = result;
	getOptions('mark');

	elem.parentNode.querySelector('.selected').className = '';
	elem.className = 'selected';
}

function buildData(array, useHighlight, generating) {
	const opt = performanceData.options;
	const obj = getContent(opt, array, generating);

	if ( !generating) {
		setHtmlContent(obj, useHighlight);
	}
	return obj;
}

function getContent(opt, array, generating) {
	const selected = document.body.querySelector('#data .selected'),
		value = selected.getAttribute('onclick');

	const arraySize = array[0],
		htmlSize = array[1];
	let matches = array[2];

	if (customMatches.checked) {
		const limit = generating ? matches : parseInt(value.replace(/^.+, *(\d+)\)$/, '$1'));
		matches = getCustomMatches(limit);
	}

	let key = [arraySize, htmlSize, matches].toString();

	if (opt.api === 'markRanges') key += ',' + opt.api;
	else if (opt.acrossElements) key += ',acrossElements';

	let obj = htmlCache[key];

	if ( !obj) {
		obj = generateContent(opt, arraySize, htmlSize, matches);
		htmlCache[key] = obj;
	}

	return obj;
}

function getCustomMatches(matches) {
	let num = parseInt(matchesCount.value);
	const count = Math.min(matches, Math.max(100, num));
	matchesCount.value = count;
	return count;
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
	shuffle(words);

	const wordArray = words.slice(0, arraySize),
		wordsLength = wordArray.length,
		words2 = words.slice(arraySize);

	let length = 0,
		matchesArray = [];
	// fills the matchesArray by words equal number of matches
	if (matches > arraySize) {
		while (length < matches) {
			if (length + wordsLength > matches) {
				matchesArray.push(...wordArray.slice(wordsLength - (matches - length)));
				break;
			}
			matchesArray.push(...wordArray);
			length += wordsLength;
		}

	} else {
		matchesArray = wordArray.slice(wordsLength - matches);
	}

	shuffle(matchesArray);

	htmlSize -= matchesArray.join(' ').length;

	const array = [],
		len = words2.join(' ').length;
	length = 0;
	// fills the array of arrays by not matching words
	while (length < htmlSize) {
		shuffle(words2);

		if (length + len > htmlSize) {
			array.push(words2.slice(words2.length - (htmlSize - length) / (len / words2.length)));
			break;
		}
		array.push(words2.slice());
		length += len;
	}

	let step = Math.floor(matchesArray.length / array.length),
		start = 0;
	// adds matches to the array of arrays
	for (let i = 0; i < array.length; i++) {
		const arr = matchesArray.slice(start, start + step);
		array[i].push(...arr);
		start += step;
	}
	if (start < matchesArray.length) {
		array[array.length-1].push(...matchesArray.slice(start));
	}

	const results = [];
	results.push('<h1>Randomly generated text</h1>\n');

	// creates random HTML
	array.forEach((arr) => {
		shuffle(arr);

		let i = 0,
			start = 0,
			next = getNext(0);

		results.push('<section>\n<p' + (enableExclude.checked && opt.exclude ? ' class="skip">' : '>'));

		for (; i < arr.length; i++) {
			if (opt.acrossElements && arr[i].length > 5 && i % 10 === 0) {
				arr[i] = generateAcross(arr[i]);
			}

			if (i >= next) {
				results.push(arr.slice(start, i).join(' '), '</p>\n<p>');
				next = getNext(i);
				start = i;
			}
		}
		if (start < arr.length) {
			results.push(arr.slice(start).join(' '));
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

