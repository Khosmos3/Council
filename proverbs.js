//if you see this, you succeeded. good job tom
let betterSeed = 0;
function getSeed() {
	betterSeed++;
	const seed = Date.now() + betterSeed;
	return seed;
}
function randomSeeded(seed) {

	seed ^= seed << 5;
	seed ^= seed >> 2;
	seed -= 836492754;
	seed ^= seed << 4;
	seed += 999;
	seed ^= seed >> 7;
	seed += 128936382;
	seed ^= seed << 2;
	seed += 128936382;
	seed ^= seed >> 6;
	seed -= 42099;
	seed ^= seed << 1;
	seed ^= seed >> 9;
	seed /= 0xFFFF;

	return Math.abs(seed) % 1;
}
function random01() {
	return randomSeeded(getSeed());
}
function randInt(min, max) {
	return Math.floor(random01() * (max - min + 1) + min);
}
function choose(arr) {
	return arr[randInt(0, arr.length - 1)];
}

function chooseWeighted(scrolls) {
	const t = random01();
	let acc = 0;
	for (let i = 0; i < scrolls.length; i++) {
		const scroll = scrolls[i];
		if (acc <= t && t < acc + scroll.weight)
			return scroll;
		acc += scroll.weight;
	}
	return scrolls[scrolls.length - 1];
}



function getFont(fmti, fontSize, fontFamily) {
	const fmt = fmti ? fmti
		.split("")
		.map(v => ({
			b: "bold",
			i: "italic"
		}[v]))
		.join(" ") : "";

	const font = `${fmt} ${fontSize}/1 ${fontFamily}`;

	return font;
}

function extractFormatting(text) {
	let format = new Array(text.length).fill("");

	let output = "";

	let bold = false;
	let italic = false;

	let escaped = false;
	for (let t = 0; t < text.length; t++) {
		const char = text[t];

		if (char == "&" && !escaped)
			italic = !italic;
		else if (char == "#" && !escaped)
			bold = !bold;
		else if (char !== "\\" || escaped) {
			output += char;
			const fInx = output.length - 1;
			if (bold) format[fInx] += "b";
			if (italic) format[fInx] += "i";
		}

		escaped = char === "\\" && !escaped;
	}

	format = format.slice(0, output.length);

	return { text: output, format };
}

function getFormattedHTML(text, format, fontSize = "16px", fontFamily = "Arial") {
	let out = "";
	let currentFont = "";
	for (let i = 0; i < text.length; i++) {
		const font = getFont(format[i], fontSize, fontFamily);

		if (font !== currentFont) {
			if (currentFont.length) out += "</span>";
			out += `<span style="font: ${font};">`;
			currentFont = font;
		}

		const char = text[i];
		if (char === "\n") out += "<br>";
		else out += char;
	}
	out += "</span>";

	return out;
}



class Proverb {
	constructor(line) {
		line = line.trim();
		const index = line.lastIndexOf("|");
		if (index === -1) {
			this.text = line;
			this.authors = ["unknown"];
		} else {
			this.text = line
				.slice(0, index)
				.trim();
			this.authors = line
				.slice(index + 1)
				.split("/")
				.map(author => author.trim());
		}

		this.length = 1;
		let escaped = false;
		for (let i = 0; i < this.text.length; i++) {
			const char = this.text[i];
			if (char == "/" && !escaped) this.length++;
			escaped = char === "\\" && !escaped;
		}
	}
}

function getNormal(x) {
	return Math.log(1 / x - 1) / -1.68;
}

function seededRandNorm(s) {
	let r = getNormal(randomSeeded(s));
	r /= 6;
	r += 0.5;
	return Math.max(0, Math.min(1, r));
}

class Scroll {
	constructor(title, proverbs) {
		this.title = title;
		this.proverbs = proverbs
			.trim()
			.split("\n")
			.filter(line => line.trim().length > 0)
			.map(line => new Proverb(line));
		this.size = this.proverbs.length;
		this.seed = this.size ^ this.title.split("").reduce((a, b) => a ^ b.charCodeAt(0), 0)
		this.descrition = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";
	}
	computeWeight(totalSize) {
		this.weight = this.size / totalSize;
	}

	randomOffset(i) {
		return Math.floor(seededRandNorm(i + this.seed) * 7);
	}

	getProverbLocation(proverb, index = this.proverbs.indexOf(proverb)) {
		let newLines = 0;

		let place = 1 + this.randomOffset(-1);
		for (let i = 0; i < index; i++)
			place += this.proverbs[i].length + this.randomOffset(i);

		const location = place + (proverb.length > 1 ? "-" + (place + proverb.length - 1) : "");

		return location;
	}
}

const scrolls = [
	//uncatergorized proverbs	
	new Scroll("Onter", `
		&Maybe we'll prune them sometime / Maybe they'll grow& | hyacinth
	`),
	//actual kinda philosophy thats more clear and just very high tier stuff | from now on will require a consensus between 2 prophets to add to
	new Scroll("Illuminating", `
		Do not give in to fear | tom
		You're a dream... A nightmare... | AI
		The dappled light upon the ground reminds me of the distance | hyacinth
		My consciousness glints in the autumn light | hyacinth
		They were too committed to symmetry and thus missed balance | hyacinth
		Wherever we may be found, wherever we may see day next, just know we *were looking for them* | hyacinth
		A torrent of thoughts shall drown us all, in the end | hyacinth
		Things are, in fact, as they seem | hyacinth
		What's it like to be &alive& alive? | wes
		The end of the road away from confusion is where you break | hyacinth
		Silently selected, washed, and reincarnated | tom
		You can cleanse yourself any day you like and however you like | tom
		One day you will realize the ability you possess | tom
		The vistas with snow-covered trees, and the sun reflecting off snow crystals to create brilliant, shining obelisks of light | tom
		Fluttering in the afterglow | hyacinth
		Femtoseconds away from ending the love of your life | hyacinth
		&Thinking& doesn't bend the spoon | tom
		The dust of today is the you of tomorrow | tom
		Friendship looks golden in the pale moonlight | hyacinth
		Cry for your eternal soul | tom
		Just because you see someone else's reflection in the mirror doesn't mean it will last | hyacinth
		Our shadows are bookmarks the universe leaves to remember where she put us | molly
		Missing a distinct opportunity is a sign of resignation, contentment, or idiocy | tom
		Bow to the universe | hyacinth
		Uncharacteristically established in your place in the universe | tom
		Try and arrange your thoughts in circles (the chances are higher that way) | hyacinth
		It's just us | hyacinth
		The finality changes but the statement stays the same | hyacinth
		Paper-free soul | tom
	`),
	//suffering
	new Scroll("Suffering", `
		You're so happy! You're so relieved you're not dead | AI
		I will be with you the day you die, that day is now | tom
		We hope that you find comfort in the fact that you have the capacity to move around and think | tom
		Improvement is inevitable | hyacinth
		We may never become better, but we will do better | AI
		Sacrifice the bean | sofia (t)
		It's almost funny how many there are, if it wasn't so searing | tom
		Every action that you take counts towards your punishment | tom
		Typing, typing. They've been typing for the longest time and I can't wait any longer | tom
		Copying block after block after block / When will it be built? | hyacinth
		Killing them won't help your condition | tom
		Helping your condition won't kill them  | hyacinth
		Would you like to experience having your limbs removed? | hyacinth
		It's markedly unpleasant to spend this much time out there | hyacinth
		Do your best to stay outside | hyacinth
		The bugs are screaming | hyacinth
		Your skin is begging to break free | hyacinth
		The air cuts deep into the scars in your skull | hyacinth
		Screaming through the holes in the wall | hyacinth
		It hurts to stop screaming | hyacinth
		No please stop it oh no not the &chin& | hyacinth
		Rolling down a hill with tragedy at the bottom, debating the merits of existentialism | hyacinth
		Rest quickly and with ease | tom
		That's when they eliminated your home | hyacinth
		Half of your soul is left, feel free to see yourself out | hyacinth
		I hate what happens to that word for suggest when you make it a gerund (-ing) | hyacinth
		My head is &rolling& down the stairs | hyacinth
		Schools don't know that you &could& read | hyacinth
		Regret tangles your time off this week | hyacinth
		The distance is mesmerizing and difficult to win against | tom
		Here's your report / Where did you &get& this? | hyacinth
		The lil' guy is bite | hyacinth
		Biting through layers of artificial cartilage | hyacinth
		Don't live by the nature of suffering | hyacinth
		Don't forget your keys before leaving the house | declan
		Evil, evilness! / Terrible | forrest
		Encapsulated is the cri de coeur | tom
		A cacophony of binder clips, shrill and inconsolable | molly
		Beating without the pulp | tom
		&Un-pinning joy from your quick access& | hyacinth
		The lil' guy can't feel his toes | hyacinth
		Captured and canned | molly
		I created the monster, you just &refined& it | molly
		Can't you feel the pain of your dimension? | tom
		Now you know that pain has meaning | tom
		Truly bad situations | hyacinth
		Neither can we escape the night nor enjoy it | hyacinth
		If held to skin for long enough, the fire won't hurt anymore | shannon
		Stressy depressy lemonzesty | mele
		Battered and boxed | tom
		Corduroy bananas | hyacinth
		It's ok if you're getting ahead (you don't deserve a neck though) | hyacinth
		Don't fear* the establishment | hyacinth
		Hidden from those who descend | tom
		Nobody* calls me that | hyacinth
		Hang on, we're contemplating retribution | molly
		Have some respect for the meter stick / You never know when your roles will switch | hyacinth
		A claim this world is hell is subjectively truthful | tom
		You have stolen the free samples | hyacinth
		Almost fast enough to reach the mailbox | hyacinth
		There's always time to cry | sofia (t)
		...pending execu...ebating consultation / try resetti... / ...t tearing...hurts | tom
		New pain records! | hyacinth
		Everything is porous in some sense and dimension | tom	
		You could survive off less | tom
		Forced into recollection | hyacinth
	`),
	//a good book, high tier proverbs, logic / thoughts
	new Scroll("Okrates", `
		&Nearly incomprehensible farmer accent& / Goddam spots in the harvesters again &spits& / Get the blowtorch and lure | tom
		Buying candles from a thrift store | hyacinth
		Selling wax cylinders for unreasonable profit | tom
		Your friend has a large bag of colored disks | hyacinth
		The human eye can divide into multiple sectors, one for each color | tom
		Beams of light: the things which sneak within | tom
		Lost in monotonality | tom
		Nothing compares to the excitement of opening a tree | hyacinth
		Surges of unification | tom
		You have acquired salutations | tom
		To be free from any external and internal suffering is very, very difficult | AI
		If you hear them, do not touch 'em when you are hungry. Even if you touch them when the sun sets, this may seem strange | AI
		I can't feel the extremities of consciousness anymore | hyacinth
		No better way than simple communication to reach our goals | hyacinth
		Death is a myth | tom
		A semicircle indicates happiness and contentment | tom
		Once again, we begin | tom
		Praise to the ascended | tom
		Carving significance out of those you forgot | hyacinth
		Passing thresholds in our minds | hyacinth
		Ambiguous descriptions of everyday phenomena | hyacinth
		Common sense is a plague that can only be destroyed by common logic | tobyn
		They are on the move | hyacinth
		They are &rising& quickly | hyacinth
		Assumption is the doorway to new ideas | tom
		Humans and the beings they occupy | tom
		Losing a game of chance on the way to work | hyacinth
		Slightly closer to false goals | hyacinth
		A long way to go before you'll stand here steadily | hyacinth
		Don't worry about it | tom
		So many words, so little meaning | tom
		Why do we &think& so poorly? | hyacinth
		Organizing thoughts in a peculiar area | hyacinth
		A hop, skip, and an interdimensional jump to conclusions | hyacinth
		The power of the strange unity of soul, spirit, mind, and body | tom
		Your mind; a thought strainer | tom
		In a space deafeningly dark / Seek that which you will not find | hyacinth
		Let's stay away from the truth and make our own | hyacinth
		Specificity is acceptable but only in the abstract / I feel like that's the rule I was looking for but did not have | molly
		A repository for your thoughts and ideas / Kept safe from the storm | tom
		Retract that thought! That one. The one you thought of when I said "that one" | tobyn
		They are &always& vigilant / Not one of your thoughts will pass them by | hyacinth
		To add, but not to change | tom
		Such is the soul | tom
		That's about it | tom
		The content of their character shifts depending on the device | hyacinth
		Can't you see your eyes are lying to you? | tom
		The makers are also subject to the ills they portray | tom
	`),
	//you
	new Scroll("Isfaths", `
		You will be lucky / Turn to the sun and be fearless | tom
		You will be unlucky / Turn to the sun for its gracious mirth | tom
		You are lost | hyacinth
		You are found | hyacinth
		You are being searched for | hyacinth
		You are the entire vehicle of change | tom
		The greatest thing is that you are now a human being | tom
		You must know ONE DAY YOU WILL BE HELD | tom
		There are a few moments of truth. Five have passed but you've only realized one | tom
		You do not hear evil | tom
		Several pieces of advice for you and mine | hyacinth
		Your will to live contains a remarkable amount of embroidery | hyacinth
		You are encompassed | hyacinth
		You put it on, you fade away | hyacinth
		You can't move &that& quickly here | hyacinth
		I like how you remembered that | tom
		You've been hard at work | tom
		Enjoy your interactable labour | hyacinth
		Test your system | hyacinth
		You have been afflicted with the "end of days" | hyacinth
		Why are you crying? Only &the worst& happened | hyacinth
		You can't hear them skittering over the surface | hyacinth
		You must first thaw the body to thaw the soul | sofia (t)
		Contain your phony celebration | hyacinth
		You have arrived at my destination | hyacinth
		Don't look where you can't see | hyacinth
		Of course you understand | tom
		"You" are alive | tom
		Become strategic when you can't | hyacinth
		You have one* chance to learn this, and &you& aren't even paying attention | hyacinth
		You don't work here but the customers &know& you, / you haughtily sit behind the counter, / hiding, hiding / for a 9 to 6 work day | tom
		It can't hurt you | tom
		Despite you, I feel ᴇᴄsᴛᴀᴛɪᴄ | tom
		You are tantamount to the big picture | molly
		You're plainly very | tom
		A collection of cells, a collection of strands, and your unique being | tom
		Wait! That's not yours! | tom
	`),
	// its the title. its just hubris
	new Scroll("Hubris", `
		Sleep well. Nothing foreboding, it's not like you have only this last chance. Just... a good idea | tom
		The houses are only separated by colorful banners inscripted with avant-garde medieval symbols | tom
		Control, down-shift, now park the car | tom
		The frugality of an onion is overrated | shannon
		The growing ball of dirt is simply a distraction | hyacinth
		Do not concern yourself with them | hyacinth
		To reach enlightenment, you must imbibe | hyacinth
		To go on living life like this is as impossible as dying is | AI
		Weather predictors are false prophets, do not listen to their heresy | tom
		Happy dreams keep you happy in a dream job | AI
		An impressive drift-catch | tom
		I am familiar with the vibe from whence you arrived | hyacinth
		You must be swollen | tom
		You don't want to stay out of sight for a while | hyacinth
		They're probably fine | hyacinth
		Don't feel shame when you fail, feel it when you succeed | hyacinth
		Tiled bedroom for you and yours | hyacinth
		Use an umbrella to keep rain out of your soul | hyacinth
		Pitiful fractions and refractions of the shadows of doubts flicker across the minds of the human race. Only those holding their homes tight to their chests are delivered to comfort by fear | hyacinth
		Make sure to brush your head, you might get cavities | rowan
		Meatballs are strictly less painful than daggers | molly
		There's nothing in the pudding | hyacinth
		It probably won't exceed the capacity of the known universe | hyacinth
		Earth is unimportant but it doesn't matter | declan
		Although simple in principle, the process is difficult to unravel | tom
		Who's your least elevated character | tom
		Sanctity is the mnemonic device | tom
		Black is the new black | shannon
		Try visiting the amusemezall some time! | hyacinth / wes / molly / zoë
		Trying on suits whilst being a ghost | hyacinth
		Be afraid! | declan
		When we say rats, we don't really &mean& rats | hyacinth
		This is not a fire hazard! / Nuh uh, totally not, just ignore the risk of fire | hyacinth / forrest
		Tomato, potato. Who cares? | hyacinth
		Damn I should've brought a flashlight | mayzie
		Don't look yourself in the eye | hyacinth
		It can be dangerous to give flowers to all those who pass | hyacinth
		Don't make gaps out of left | hyacinth
		You know, like sauce of the brain | wesley
		What are you asking? / This is the question | declan / hyacinth
		Stop looking so gruntled | hyacinth
		The coating, though effective, is very unnecessary | tom
		I bet if we ran into that fence fast enough, we would go on an adventure | shannon
		Just cause it's on fire doesn't make it a &bad& destination | hyacinth
		The world* is &exactly& what it seems | tom
		* "They," in this document, can be assumed to be only singular | hyacinth
		Pronunciation is strictly subjective | tom
		The title was composed of five adjectives and a single meaningless phrase | hyacinth
		We &all& feel bad | hyacinth
		We've got plenty of room | hyacinth
		Don't trust the koala-headed man | tucker
	`),
	//animals and... bread?
	new Scroll("Dilap", `
		Cavehorses can't even walk around in mud | tom
		Peppers are toxic, perhaps | henry (t)
		Some rocks are healthy, actually | hyacinth
		Bread was never an animal | declan
		They plead for toast | hyacinth
		The birds will save you from yourself | hyacinth
		The birds will be your downfall | hyacinth
		The horses are here, they wish fortune upon you | hyacinth
		Bird and primates sometimes have similar degrees of skill at aviation | hyacinth
		From little acorns large octopi grow! | molly
		The pulverized seeds glisten in the fluorescent light | hyacinth
		Don't look at the barley | hyacinth
		Raisins in deeply sorrowful locales | hyacinth
		There is no horse on the water | rowan / tom
		Birds falling to the sea | hyacinth
		All cats have the innate ability to become a chef | tom
		Tamedflowers and wolverines (they mean you no harm) | hyacinth
		Wombats in the basement, climbing up, &up&, #up#! | hyacinth
		Several geese in a sine wave | hyacinth
		&Shhh! Don't tell! The hippopotamus is hollow& | molly
		The ants are listening | declan
		The answer: listening... | molly
		The horrifying screeches of well-winged creatures | hyacinth
		Psst. Come hither candy. Would you like some children? | molly
		Do not operate heavy machinery while under the influence of willful iguanas | molly
		The clams have come unhinged. | molly
		A murmuration of antelopes dazzled overhead | molly
		Barnacles: discuss. | molly
		Barnacles, discuss! | tom / molly
		O'erhead, the cuttlefish flying south for the winter... | molly
		A escassez de palavras para descrever certas vivências e emoções é… sufocante, talvez? | gabi
		The dodo bird had always believed he had plot protection | molly
		Toast: truth or a good story? | molly
		The platypi left for a night on the town, and returned with opposable thumbs | molly
		Egg-laying mammals have increased use for pockets | hyacinth
		Sheep do what they can't | hyacinth / tom
		Ground up grains with a helping of pain | tom
		Wasps in the hive | hyacinth
		Birds have windows to our souls | declan
		I have claimed this spot with my lingonberries and paper | wesley
		Is there food made entirely with rocks? | noah
	`),
	// mid - high tier proverbs in general and insanity, light
	new Scroll("Praculae", `
		A simple, everyday, all-consuming life routine | tom / AI
		Good insanity is necessary as it will leave no room for bad insanity | tom
		Insanity is just the eye of the storm | tom
		A crescendo on conscious always precedes madness | tom
		Cynicism is futile | tom
		Manners in a state of anarchy | hyacinth
		So I've made up my mind now | tom
		We're only doing this if we all die | tom
		Almost to the end! / Let's not think about what happens next | hyacinth
		You will need to wait a little longer | tom
		It never gets old. It doesn't need to | tom
		There is nothing left - not even the truth | AI
		The books within visible writing are the easiest to understand | tom
		An image is worth twice as much as a ten hundred words | tom
		You only get two first impressions | hyacinth
		Droplets of heaven spill into the cave | hyacinth
		We didn't know you could be this awake | hyacinth
		We haven't slept | hyacinth
		You can't &still& be awake | tom
		You &know& how to sleep, right? | tom
		Feelings of another supersede feelings for another | hyacinth
		Feelings of one intercept feelings of the other | tom
		You create reality to prevent insanity | tom
		You create insanity to prevent reality | ryan
		I need to stop the madness and start putting my mind to rest | tom
		In identity phase II, you can spend an enormous amount of time and money to swap your best and worst days | hyacinth
		Although different in many ways, affection and insanity are dueling twins | tom
		Where's he, late to sanity? | hyacinth
		Fluidity of the soul | hyacinth
		Who's knocking on my head at this time of night? | hyacinth
		Running down walls | hyacinth
		Walking on Reque Road | tom			
		Decrepit and unsatisfactory weather | tom
		A fight between spirit, soul, and mind | tom
		Following the traditional methodology for expertly and precisely disassembling your (yours) or their (their) mind(s) | tom
		Various dents indicate your dedication | hyacinth
		Au contraire! I am not a home for insanity! | tom / shannon
		Insanity brings greater comfort than clarity in a disaffected space | hyacinth
		Filming the steps to insanity | hyacinth
		My shadow is a demon, thirsting for my blood. / I first figured this out at age 13 and have been hiding in the darkness ever since. / If there's no light there's no shadow. If there's no shadow there's no demon. If there's no demon, I stay alive. / Alive in darkness slowly going mad | mayzie 
		Retrorefractivity | hyacinth
		Keep making the photosensitivity larger | hyacinth
		&Completely& unreactive | tom
		It &hates& the blacklight | tom
		We are ever so close to our downfall / Let's get going then! | hyacinth
		Creating instances of friends and family | hyacinth
		A punctuation mark specifically for rhetorical questions | hyacinth
		Threatening slashes / Rapidly approaching punctuation | hyacinth / tom
		Periods for emphasis | hyacinth
		Truly bizarre strings of characters, stored amongst the weather | hyacinth
		They're working together on the "project" | hyacinth
		Decent, just decent?! That's it?! | forrest
		Poorly organized humans | hyacinth
		We all &want& it, we just can't &have& it (obviously) | hyacinth
		Common sense is whatever I want it to be | hyacinth
		Everything out of order / Everything in space | hyacinth
		Howling in an empty room / Where are the walls? | hyacinth
		Revel in what you do not know | tom
		My brain spits out specifics like you wouldn't believe | molly
		It likes to highlight | tom
		Hasn't it ever crossed your mind? | tom
		The core of the air / The borders of the night / Those who hide. feast. bite. | hyacinth
		You'll know it when you see it / Or you'll think you're going insane | hyacinth
		We've got something appropriate to fill in the gaps in your mind | hyacinth
		Storm of your amber eyes | tom
		I come from the other place, where voices are outside your head | alex
		Thinking is terrifying / At least, that's what it wants you to think... | tobyn
		So, all thoughts should be about not thinking, / so even if you happen to think you will only be able to think about not thinking, / which means the object of thinking will be lost in a flood of thinking about not thinking / and your thoughts won't be productive | tobyn
		Madness that isn't yours, despite your contribution | tom
		Low equality in nonsense contribution | hyacinth
		Nearing consciousness / Fearing consciousness | hyacinth
		Looking ever closer | hyacinth
		He's unambiguously plural | hyacinth
		Take your mercy out on me | tom
		You ought not to have a mind where you're going | hyacinth
		You can feel that your mind is about to collapse at any time | hyacinth
		I'm going to put you in the Mind Room | tom
	`),
	// pleasant thoughts
	new Scroll("Ique", `
		The lil' guy has a delivery for you | hyacinth
		The lil' guy's skull contains a celestial body | hyacinth
		The lil' guy has an object | hyacinth
		The lil' guy is unwinding | hyacinth
		Chestnut-warm heart | tom
		This spot... the lil' guy is here right now and having a wonderful time | tom
		The lil' guy's future is looking up | hyacinth
		The lil' guy's completely alright | hyacinth
		Collections of memories, warm with nostalgia | hyacinth
		Even across the distance, the warmth of community crackles in the cold | hyacinth
		It's cozy here, far from the barren glow | hyacinth
		It's done, you can breathe again | hyacinth
		Your place will meet you when you least expect it | hyacinth
		It's fuzzy here, your blanket snug between a rock and hard place | hyacinth
		There's something here for you | hyacinth
		The grain of the wood runs in the direction you'd expect | hyacinth
		The lil' guy is instigating | hyacinth
		From the top of my heart, I wish you good fortune | hyacinth
		The lil' guy is &always& counting sheep, may he never rest | hyacinth
		The lil' guy is borken | hyacinth
		The lil' guy hasn't breathed since the last time he smiled (he has plenty of oxygen) | hyacinth
		Embrace, and be held | tom
		The halls are so soft when you love them | hyacinth
		Hey, hey. It's not a bad thing | tom
		The lil' guy is &done& waiting | hyacinth
		The lil' guy will see you now | hyacinth
		The lil' guy plans on verticality | hyacinth
		A wrinkled piece of home | hyacinth
		Freckles on your soul | hyacinth
		Focus, don't worry. Everything is love and warmth | tom
		I would be &unearthly& happy | hyacinth
		The lil' guy is here for his apple juice / He needs a graham cracker to go with | hyacinth / molly
		You have done that which &can& be forgiven | hyacinth
		Asleep on a cylinder | hyacinth
		The lil' guy's plum tuckered | molly
		The lil' guy is experiencing emotions | hyacinth
		The lil' guy thinks the battery is going to eat his sheep | hyacinth
		Look at the lil' guy! | hyacinth
		Freckles on your heart have a neutral connotation | hyacinth
		Despite everything, you're pretty much always still yourself | tom
		Resting in a quiet apocalypse | tom
		Spinning around on the way to the hound | hyacinth
		The faceless sheep can see you. / They are also really cute | declan
		Just kinda dancing on the dashboard of a car | hyacinth
		Decency glows underneath despite the dust | anna
		Sunny shiny sweet spun sugar | mayzie
		Like a bucket, but for humans | hyacinth
		Creating a tripping hazard (simply for the inevitable power?) | hyacinth
		You'll be ready for what comes next | tom
		Joy on a blue day | hyacinth
		Feeling fluffy on a Friday | hyacinth
		They are &bounce& | sofia (t)
		Contain the child | william
		Sprinkling my home with light | tom
		Letting the others keep the time | tom
		An unending sequence of silent screams | hyacinth
		The lil' guy is waterlogged | hyacinth
		A ˢᵐᵃˡˡ ᵏⁿᵒᶜᵏᶦⁿᵍ at the entrance | hyacinth
		Inopportune romance | hyacinth
		Capital me and lowercase me | hyacinth
		The chilling breeze reminds you of home | tom
		The sunset reminds you of comfort... | tom
	`),
	// in the title
	new Scroll("Unpleasant Thoughts", `
		Carpeted windows | tom
		Guitar of vocal cords | tom
		Don't build an atom bomb with teeth | rowan
		The fan companies have a plan | tom
		Stop voting at all, you're a fool | tom
		The potatoes are watching, the corn is listening, and the grapes are feeling your skin. Right now | hyacinth
		A hundred and one thousand days, which they want to get rid of, but they do not | AI
		There's an old gentleman inside the house. Currently / The old woman is later, don't worry | tom
		The phone is out of range | hyacinth
		A breath of fresh air | tom
		It's getting uncomfortably close | hyacinth
		Your teeth &sure are malleable& | hyacinth
		You'll never be awake | tom
		Give back what you took, so I don't lose them both | hyacinth
		If you get too close to your friends you will &#experience#& | hyacinth
		Teeth under your skin, rising | hyacinth
		Dusty, porous faces | hyacinth
		Some more, dusty | hyacinth
		Holes in the floor (by design) | hyacinth
		You do realize these aren't &actual& newlines, right? | hyacinth
		If you consider your thoughts, will you find that dramatic and unbearable change will be required to rid yourself of the things you enjoy? / Occasionally, actions are imbued with positivity solely by ceasing to reason | hyacinth
		I'm going to add another case | tom
		The pages of the book are deceiving in length, but surprising well priced | tom
		Contribution feeds that within you which should starve | hyacinth
		Cartilaginous head handles | molly
		The craft is insufficient | tom
		Number of fingers is an appropriate basis for a hierarchical society | tom
		Too much teamwork corrupts the mind | hyacinth
		Collaboration for the greater bad | hyacinth
		Decidedly unappetizing drywall | hyacinth
		Feeling your neurons swell | hyacinth
		Yelling at the bottom of your lungs | hyacinth
		Vitamins in the skin | hyacinth
		You guys know my longstanding antipathy towards mayonnaise | molly		
		The wiring in the walls goes unused, just like before | tom
		It all falls apart when exposed to insulation | hyacinth
		You just wish a couple more disasters would find their way in front of you | hyacinth
		Too fuzzy to be sticky above most circumstances | hyacinth
		Some people panic when they hear this, / but the truth is... | hyacinth
		Helpless in opportunity | hyacinth
		Salmon: Engage your landing gear (somber) | molly
		Popcorn filled pillows (tired) | tom
		Dehumanization is "ok" on Thursdays | hyacinth
		The lil' guy is feeling ominous | hyacinth
		It's actually really funny to look at your bones when they do that | rowan
		Conducting a poll: head, shoulders, knees, or toes? | molly
		Cracked, shriveling fingers | tom
		Boiling vats of kidneys | hyacinth
		It's like warmth, but it isn't | tom / shannon
		Hope in the drain | hyacinth
		Cheese grater for the soul | hyacinth
		Every thought you have you lose a hair | tom
		Two minds completely make up for your lack of a body... | hyacinth
		Two bodies do not make up for your lack of a mind... | tom
		An unbeating, atrophied face | tom
		Frogs in the throats | hyacinth
		We're out of air | hyacinth
		They are &in the house& | hyacinth
		Phantoms in your clothes | hyacinth
	`),
	// what does this ***mean***, business
	new Scroll("Sputilations", `
		Mass production companies of tether cords are being overrun by small scale, local businesses producing tether cords | tom
		No soul, no service | hyacinth
		We only sell #solid# plinths | tom
		The containers keep on costing greater amounts | hyacinth
		Last edit was a bit ago and you don't know what it was | tom
		A new random object has been added to your living room aesthetic | tom
		A new random object has been removed from your living groom aesthetic | hyacinth
		Your own mind always seems to bend | tom
		The world is an illusion and never will be / Everything is impossible | tom
		To experience their own former apathy and abuse | tom
		Commanding the components | tom
		The weather must be treated carefully, it's quite slippery | tom
		There is something inside of out | tom
		The electrical cords are grinning broadly | hyacinth
		If you don't evacuate your network, what can you expect to gain? | hyacinth
		We may be in business | tom
		Sir Bones and the Temple of Temperature | tom
		And gotten a business license in my name / and taken over the world | hyacinth
		I can pay you in &#constancy#& | hyacinth
		Ostriches make &great& vacuum salesmen! &shh sh sh sh sh, just trust me on this one& | hyacinth
		Door locks are the career to good business | tom
		Several dimes for your time | hyacinth
		A few &run o' the mill& injuries | tom
		More information may be found in the walls | hyacinth
		It's fluffy here in the place I should be trying to leave | hyacinth
		It hurts more to know &how& to fix something | hyacinth
		The surface of the ocean you're drowning in is just more oil! &You& can't breathe | hyacinth
		Crop circles encoded into your genes | tom
		Crop circles encoded into your jeans | tom
		Resignation? No, please, re-sign this paper | tom
		Signing off your doom | tom
		Cents, it happened | tom
		The capital owners love puppies | declan
		Trustworthy lawyers, planning on helping* you win your case! | hyacinth
		Terms of the contemporary | hyacinth
		Breathing is &not& OK in this establishment | hyacinth
		Five bellowing souls in jars behind the register | hyacinth
		Business lunch with the beings below | hyacinth / rowan
		Getting used to catastrophic inputs can be uncomfortable in hindsight | hyacinth
		Fresh baked sand. Right out the oven. For &free& | tom	
		How about &this& deal? | tom	
		The payment depends on the quality | tom		
		The Company is losing its battles | tom
		Making money by restricting soap supply | tom
		Having hair is a sign of status | hyacinth
		We'll take your false idols | hyacinth
		They've got &unlimited& stock | hyacinth
		$1.⁵⁷ worth in severe damages | tom
		Wheat is the only product which produced &real& value | hyacinth
		Who's removing the shops? | hyacinth
		It doesn't give off the gleeful sturdiness of &real& iron | tom
		Salvation* costs more than you may expect | tom
		A gradual recompense for "home" | tom
		Three offers, not pending | hyacinth
		The heavens are bankrupt / They're liquidating the stars to balance the debt | molly
		A slight uptick in shoes | tom
		Ooh I can get a formless body? | tom
		Not even $3, more like a dime | hyacinth
		We only sell / We never buy | hyacinth
		Now &that's& something | tom
	`),
	// honest stuff, no funny business
	new Scroll("Ti", `
		The blind man knows, the deaf man speaks, but the wise man can only hear | tom
		An eye for an eye makes the whole world able to hear better | tom
		Reality is not about you | tom
		Reality is purely you | tom
		Reality is a lie | tom
		Elements of the being: Soul, Spirit, Mind, Body, and Bone | tom / hyacinth
		Rumbling in the soul | tom
		Shattering of the bone | hyacinth
		Division of the body | tom
		Quenching of the spirit | tom
		Twisting of the mind | hyacinth
		Realer than should be possible | tom
		To live without being distracted | tom
		I do not know from whence I speak | hyacinth
		The future you've seen is real / It has been there since after all | AI
		Let yourself admit it | hyacinth
		Don't fear the immediate | hyacinth
		Don't add to things you wish were gone | hyacinth
		Medium sized lighting and numerous blankets makes for a comfortable evening | tom
		Such is existence | tom
		With hope and belief in oneself | hyacinth
		You are covered in bindings and strings | tom
		A burgling most shameful, wrought in daylight | hyacinth
		If I had a dollar for every good deed I've done, I'd have several dollars by now | alan
		Writing partially disparaging remarks leads to a lottery of first impressions | hyacinth
		Similar pain for dissimilar people. / Is grouping by this really advisable? | hyacinth
		Portions of recollection, even organized by perceived significance, will always degrade eventually | hyacinth
		Speak well enough and you may get an education / Speak poorly enough and your words will have worth to the crowds | hyacinth
		There're worlds beyond these | tom
		Stop fighting the nature of your goals | hyacinth
		Break down the barriers that keep you from making your greatest mistakes | hyacinth
		Only feel bad around others | hyacinth
		Don't justify their actions | hyacinth
		The octopus twiddled his tentacles as the world dashed madly on | molly
		Our creator has no guarantees | hyacinth
		Discovering those within your soul | hyacinth
		So old you're past "age" | tom
		Too young to use "stupid" | tom
		Pure thoughts: no thoughts | hyacinth
		Like an anchor keeping me from floating away | mayzie
		Stubbing toes in the sandbox of life | tom
		Failure and winning are linked. To win you must first fail | mayzie
		Circumspect intentions lead to winding executions | hyacinth
		There're two devils inside every one of us | tom
		Advice for morally decrepit | hyacinth
		None of the cool things are easy | hyacinth
		Your knowledge is yours, although it may change without your will | tom
		On a sinking ship, given the choice between a first-class suite and a lifeboat, you chose the former | hyacinth
		Feels like rooms in an infinite mansion... is there an outdoors? | tom
		Almost always if the answer is genuinely yes | molly
		If you lie well enough, disguise in unneeded | hyacinth
		The best lines from a book no one's read | hyacinth
		Maybe I need to think outside real life | tom
		You can only go there two or three times before you can't leave | hyacinth
		One or two strands of our minds connect us to others | tom
		It is central to your own philosophy | tom
		People need to see dead ends for themselves | tom
		You need to slow down | hyacinth
		But, in a way, that explains nothing | hyacinth
	`),
	//death, cycles, circles, birth, rebirth
	new Scroll("Circles of Polarity", `
		Am I dead? | tom
		We don't believe in death | tom
		I am alive again. The sun has come full circle... and now I am standing in a sun-flicker... | AI
		You would prefer to be cautious of death | AI
		Fairy Tales and the Death of Humankind | tom / AI
		Concision and the Art of Knives | hyacinth
		Rite of Idleness and the Fun Time | tom
		Run away, you won't end up where you started. Ever | hyacinth
		Run away, as slowly as you can bear | hyacinth
		The end of the world at the doorstep and Ij'o wept tears of posterity to be alive and selected | tom
		Nothing left but ash and real life | tom
		Running in threes | tom
		What? Did I think of something? | hyacinth
		Watches are the hands of eternity | tom
		Hues keep on rotating until they die | tom
		Only you can determine, I will tell them in the order they came to me | molly
		Nobody except you knows your location, geographically and possibly in some other way if you see the metaphor in this | tom
		Trust me officer, no laws, physical or otherwise, were broken | hyacinth
		There's a reason it's called a life cycle | tom
		You struggle to sleep during soul storms | hyacinth
		It's not a &bad& thing, at least on how &we& view death | tom
		If it appears dead, inside it's more alive than ever | tom
		I can &feel& again | hyacinth
		Dying isn't an effective method of transportation | tom
		And I die, again, c'est la vie | tom
		Walking in the circle, I found the end | anna
		Hallelujah! The cataclysm's closed. "Gone fishing," the sign said | molly
		Somewhere between hither and thither | molly
		Faint scratches of strange minerals upon the corpses of our ancestors | hyacinth
		What style of... gravestone? | tom
		The line between life and death is pretty thick. / Still, you walk it with a high chance of falling | tom
		Don't place bets on your death | hyacinth
		Dawning on the cycle of life and death | tom
		Do &you& remember your birth? | tom
		Study your own life and times / Memorize important dates / they'll come in handy later | tom
		The circle is complete | tom
		The fruit of running | tom
		You can't &still& be running | hyacinth
		Born into a life without chances | tom
		Prepare to be born | hyacinth
		Death, a simple illusion. Life, an abstraction | tom
	`),
	// ectermine! classics here too
	new Scroll("Ectermine's Legacy", `
		It's done. All the doctors are dead. Apples are no longer necessary | tom
		An apple a day keeps the doctor away. Ten will send them flying | hyacinth
		The apple counter is non-zero. #&Panic&# | hyacinth
		Misanthrope? More like miso soup! | hyacinth
		There's nothing here for you | hyacinth
		Don't even try | hyacinth
		All hope is lost | hyacinth
		Need be has been | tom
		The eyes which await you in the void only want your mangoes, nothing more | hyacinth
		Molasses that should be eaten | tom
		Have you checked upon it recently? | tom
		I'm going to become extremely ethical tomorrow | molly
		There will never again be a house | tom
		The shards are horrifying | tom
		The shards on the walls make it feel claustrophobic | hyacinth
		(This post will not be written with any intention of making you work at the post as I am an ex-gale worker) | AI
		Don't abandon your post... yet | hyacinth
		(It was all resolved) | molly
		Glutenfree Genderfluid Girlfriend | hyacinth
		Glutenfree Genderfriend Girlfluid | hyacinth
		Glutenfluid Genderfree Girlfriend | hyacinth
		Glutenfluid Genderfriend Girlfree | hyacinth
		Glutenfriend Genderfree Girlfluid | hyacinth
		Glutenfriend Genderfluid Girlfree | hyacinth
		My head is full of names | hyacinth
		Not a single one of the plans ends well | hyacinth
		The cooks are in the kitchen | tom
		The cooks are in your living room | tom
		The cooks are in the restroom currently. Give them sufficient time | tom
		Glaciers on the move will encourage your personal growth | hyacinth
		Better than the rest of them | hyacinth
		Trans Hunds goeth fast | hyacinth
		Although small, the percentage of Vitamin C in the atmosphere was unreasonable and unmoderated | tom
		The Legend of the Braided King | hyacinth
		The foreshadows get longer at noon | hyacinth
		ɪn the space you call home / 'til the day rings true / ᴍy knights, they arrive / ɢarish and blue / ᴇnding the lines / ɴear to the brink / ᴅefeating the darkness / ᴇrased in a blink / ʀevealing the brightness / ғull of esteem / ʟeading the faithless / ᴜnder the steam / ɪn poor situation, we find ourselves here / ᴅecrepit and empty, lost amidst fear | hyacinth
		Then she gave up / Then he gave up / Then they gave up / Then it was done | hyacinth
	`),
	// short things, doors
	new Scroll("Spaoons", `
		Don't tap the keyboard twice | tom
		Suburban, urban, hyperurban | tom
		The rurals are the main source of the urbs | tom
		Subavocado | tom
		Visual mode engaged | tom
		Hello parallel human | shannon
		They approach | hyacinth
		You thought!!! | tom
		#Who# would have thought?! | hyacinth
		Chopped calcium: serves plenty | hyacinth
		Human arms: part of a balanced breakfast! | hyacinth
		Fun fact: doors are not guaranteed to be associative | hyacinth
		The handles of one-way doors are dusted with regret | hyacinth
		Containers for the heart: rib cages, love, greeting cards, etc. | hyacinth
		The escape hatch is often easier to use than the door | hyacinth
		The shortport is | tom
		Climb the pole | tom
		Living vexatiously | tom
		Lie to them | tom
		Don't lie to children | hyacinth
		Lie to children | hyacinth
		Children, for the purpose of mistruthing towards | tom
		Maul but smite-y | molly
		Spelled like ᵏⁿᶦᶠᵉ | tom
		Recursive receipts | hyacinth
		Who's ready!? | hyacinth
		So good it's illegal | tom
		Take that!?! | tom
		Wooo /    ooo /       ooo | tom
		In the house! | tom
		Why haven't &you&?! | hyacinth
		Wholly unusual fiends | hyacinth
		They go &that& fast?! | tom
		Gathered from what?! | tom
		Dark radiation | hyacinth
		Confounds abound | molly
		Remain unsatiated | tom
		Ever-slimmer margins | hyacinth
		Iiiiiiiiiiiiiiiiiiiit's suppertime! | hyacinth
		Water hazard | tom
		Converb (antonym) | molly
		Dessert: the dominant paradigm | molly
		Guess what? #&ɴᴜʟʟ&# | hyacinth
		Doors are Doors / Keys are Keys / Locks bow on their knees | declan
		Doors don't have knobs, at least they don't need to. There doesn't even need to be an opening | tom
		Particular peculiarity | hyacinth
	`),
	// apathy and surrealism and longer, story-like ones
	new Scroll("Apathetium", `
		Surreal continents continue | tom
		Meteor, across the dimmed landscape | tom
		An amber lamp for you in this paling room | tom
		Intangibility in the palm of your hand | tom
		Tattered paper documents, drifting over the road at night | hyacinth
		You &love& your coworkers | tom
		Absolute nothing! &echoes& | tom
		They have all the same memories of the day | AI
		Behold upon the pit of ash and thou shall fall into luminance | tom
		The shadows only reverse as the rain starts the pour | hyacinth
		Do your best before it's gone | tom			
		Visit them every once and a while | hyacinth
		It is not certain that we'll find anyone there | hyacinth
		The asphalt burns as you step towards the dim glow. If only they could send someone else | hyacinth
		We all belong in low saturation rooms, our consciousness and silhouettes providing the only details | hyacinth
		You can't even see the peeling paint or tattered lamps anymore, just the imprint of your warmth | hyacinth
		In the final stages, you may feel immense nostalgia (often to an unprecedented degree) / What you do is your choice and yours alone | tom
		Fog so thick that you can create anything, in pure daylight | tom
		You rarely recognize the things closest or furthest from you | hyacinth
		You rarely recognize anything | hyacinth
		We could just apply a grayscale filter to our memories and it would have the same effect | hyacinth
		The combination of incredible cold, dry air must have worked just right | tom
		An empty pit to fill the lack of emotion | tom
		Divorce papers filed in an amber room | hyacinth
		And the paladin stared across the grassland and across your soul | tom
		So many have matched the power vested within the silver coast | hyacinth
		You &can& outrun your past with good enough shoes | hyacinth
		Comforting insulation, at least. You can't feel the warmth as the walls are too thick | tom
		Damp literature in a burning building | hyacinth
		Disinterest and an unoriginal quarry | tom
		The crinkling photographs showed their paling faces on the wooden table, from underneath various candles and buttons. Now the work is done | tom
		Writing on a sunburnt plateau | hyacinth
		The tall grass in the field obscures your destination | hyacinth
		Her legs were as long as a redwood, and her head looked as if it might touch the clouds | mayzie
		Mildly unhappy people flood the offices | hyacinth
		Memórias / Aquilo pelo qual me constituo / Sou simplesmente tais memórias / Sou puramente uma memória / / (E, quem sabe, um pouco de saudade) | gabi
		Surreal and unusual, referencing things not from our world | hyacinth
		Untethered to your soul, you roam ever-farther | hyacinth
		Gaps in expensive objects | hyacinth
		A slight victory for the slugs | hyacinth
		Two left for the end, to be seen again | hyacinth
		A plethora of ways to walk over it | hyacinth
		Drip drip dripping down the vortex of vacant vapors | mayzie
		The widgets were fraught with derring-do | molly
		Forever awake, you lie alone / Repeating the chants of ice and bone | hyacinth
		Illustrious compositions in empty halls / Intricate literature on empty shelves / Shattered minds in comfort | hyacinth
		Glowing with a rich orange light / Contrasting with the fleeing masses | hyacinth
		The pure inconvenience of recollection | tom 
		The schoolyard is empty, empty of those you forgot | hyacinth
		As the ground split apart and the spines emerged, you simply sat there, somber | hyacinth
		Decrepit are they who host the night | hyacinth
		Paom across the hill | hyacinth
		Praising the broken lamps and the cracked gutters | tom
		A vast parking lot spanning across the nighttime desert | tom
		Paom's waywardness led to the revolution which resulted in citizens having more choice in their deaths | tom
		It has been taken / It has an obvious destination | hyacinth
		An amber glow crests the mountainside | hyacinth
		More emptiness | hyacinth
		Alone in the room | hyacinth
		The room &isn't& empty | hyacinth
		Spheres amidst the cornfield: grey, smooth, unmoving | tom
		Speckled sunlight and warm glow and a long, wrought-iron archway / it is here whic... | tom
		Your portrait stares back at you in this empty abode | tom
		A hilly, grass coated place | tom
		Venture into the plateau, I guess | hyacinth
		Doubled over in a speckled field | hyacinth
		To turn over the clouds / I must sink into sand / Obligatory silence for / the dun, shadowed lands / / All iron will rust / All silver shall tarnish / Your gold, hollow dust / Time, the discontent artist / / I fall past my borders / The hardened abuse / grates into my skin / A familiar noose / / My legs sore and wrung / My arms limp and burning / The world, like me / uncaring, unturning / / A sand pit of bones / A mere husk of past wrath / The martyrs are dead / no reign to surpass / / My fingers, now bloody / My back, it is lashed / The sky without sun / is convincingly ash | tom
	`),
	// time, etc
	new Scroll("Plagiarized Optics", `
		Why can't I understand clocks? | tom
		Knocking on clocks | tom
		The past is substantially more relevant to this recipe | hyacinth
		Don't undo your companions | hyacinth
		Practice running, it'll make you more &dextrous& | hyacinth
		Don't start with that | hyacinth
		Only talk of the end will be sustainable | hyacinth
		That wasn't even selfless and it pained you! | hyacinth
		Wobble like there's no tomorrow | molly
		You'd see others in the distance | tom
		What is the time and why does it chase me so? | tom
		A watch that actually works | tom
		Half eaten dreams | hyacinth
		Seconds away from a deep concern with oneself | hyacinth
		It wouldn't have been that good, trust me | hyacinth
		Negotiating with relativity | tom
		You could've done it yesterday, hell, maybe even the day before. But today? Not in a million years | tom
		Your multiple tongues | tom
		Time-based triangles | tom
		Free time is where you start to apply / Caged time is where you start to learn | hyacinth
		So much time but so little to be | hyacinth
		That hadn't happened in this timeline, nor was it expected to | tom
		Only 33 more years | hyacinth
		Just wait a little shorter | hyacinth
		Throwing relativity out #its# window | hyacinth
		Early and late are, while similar in principle, swinging twins | tom
		Early and nipore are battling demons | tom
		Don't feel when it's late | hyacinth
		Don't feel when it's early | hyacinth
		We only invent things to the #left# of our time | hyacinth
		The months will be changed every 100 years | tom
		Returning from the present | hyacinth
		If you do it at the same time, you'll destroy the entire concept of the process! You &have& to do it sequentially | hyacinth
		Backing up the world to last Wednesday | tom
		Time is flying off the shelves | hyacinth
		Temporally obese | hyacinth
		Trapped in infinity | tom
		You'll be able to do it in less than 2 minutes | tom
		It's easy to see what you've done wrong before you've messed up | hyacinth
		Many hours for falling towers | hyacinth
		Reflecting your past | hyacinth
		We all do it time and time again | tom
		If it stands between space and time, who are we to tell it "excuse me, but I want a turn"? | hyacinth
		You will be exacerbated over time | hyacinth
		Time flies, but then so does a duck | alan
		They won't be permitted for &some time& | hyacinth
		The letters close at noon | hyacinth
		Warm in your time | tom
		The pamphlets list expired dates in timestamps barely still valid | tom
	`),
	// violent unity. the whole gang is together
	new Scroll("Konradism", `
		They are up in arms | tom
		The Belldrum is full of all the things we won't have time to know | tom
		Strike by the cover of the book | tom
		Become the anvil | tom
		The strong hand sends a heavy message | tom
		Leaves crumbing to sand in the clenched fist | tom
		Banish from our cradle the idea of violent unity | tom
		Houses on the summit of a mountain | tom
		It will end more vigorously than it began | hyacinth
		It will end slowly, painfully, more mildly than it began | hyacinth
		Keep fighting against the system | tom
		The webs hold their corpses | hyacinth
		They must be enraged by the fissure | tom
		A &real& patriot will know what's best | tom
		And they suffered past twelve storms and the sharpenings of the Illuminating | tom
		The sturdy are walls for the strong | tom
		We're fighting against a machine we created a purpose for | tom	
		We don't &actually& divide them | hyacinth
		The Aplotris Soldiers stood as vanguard against the sharpness, their minds hardened by kin and storm | tom
		We aren't the ones who defend the Continent. They are | tom
		Your name reeks of vengeance | hyacinth
		Definite voids are only for the upper class | hyacinth
		Tactically placed voids | hyacinth
		We weren't firing on any cylinders | hyacinth
		Assume violence | hyacinth
		The agent's ability to respond to novel stimuli with violence will prove vital in this next exercise | hyacinth
		The nom de guerre given to the Headknight was "Ornamental Cabbage." The war effort tripled | tom
		A shocking amount of empty slots | hyacinth
		The Judges are present | tom
		Knights at the top of a hill, debating the philosophical merits of war | hyacinth
		Dulling your knife to use as a blunt weapon | tom 
		The first can decapitate with one motion. / The second requires two motions, however, there will be &zero& blood flow and thus no mess | tom
		Dragons shall be the newest mode of transportation, all old models will be repurposed for means of war | sofia (t)
		The message had been delivered: vibrant, vitriolic, and vile | hyacinth
		An invasion of morals, as opposed to an invasion of armies | tom
		Not to blame, but to accuse | tom
		Divide them, or be forced to | tom
		Oh. Well. Of course they don't know what to say | tom
		Speed-based victory | tom
		Pandemonium struck (Shots were fired) | molly
		Strategically placed eyes | tom
		Don't let them tell you what (or what not) to "do" | hyacinth
		Hope wrought of iron and blood | hyacinth
		The competitor who is able to get eighth, ninth, and tenth should take the glory | tobyn
		Woeful tacticians are flooding the armory | hyacinth
		Postponing the war | tom
		We normally operate &outside& of the standard protocol / Today we join the commoners / Tomorrow we fight! | hyacinth
		Virtually indistinguishable from freedom | hyacinth
		Kindling the revolt / &There they go& | hyacinth
		We only train &enemy& warriors | hyacinth
		Spin around and point / There you will find your place | hyacinth
		Seats at the table (symbolically) | hyacinth
		Invert the dominant paradigm | molly
		Convert the dominant paradigm | molly
		Revert the dominant paradigm | molly
		Another change / a revolution / against Entroepi | tom
		Another line has been crossed | tom
		Another army is needed | tom
		Violence in our time | tom
		Your enemy knows you. Where you live. What you ate for breakfast. Your deepest and darkest secrets. The color of your eyes | tom
		We all stay if horderves are offered / We can't promise our loyalty | hyacinth
		Laugh at the line of your superiors | hyacinth
		This was not founded in the spirit of competition | tom
		Delivering mail &can& make you an enemy of the state | hyacinth
		Steel-clad tentacles slamming against your will (as well as the hull of the warvessel you occupy) | tom
		Soul or strong spirit is needed to be "alive" | tom
		Any action you take shall be documented | sofia (t)
		Punching in the afterlight | hyacinth
		The burning sensation reminds you it's not yours | hyacinth
		Despise to be inspected | tom
		An impromptu show of force | tom
		Oh, they fought / They fought til the borders cracked / and the knot snapped. / But then our soldier / got stabbed in the back | tom
		Surround the rising humans | tom
		I want to be on the safest possible side | hyacinth
		Supporting the crews / Eluding the views | hyacinth
		Tell them to divide and conquer so you only need to destroy small, shattered groups | tom
		They appeared to my woe-trodden eyes | hyacinth
		She is &on guard& | tom
		Keep it on the down up | tom
		You can't kill those ones | tom
		They are in &lock-step& | hyacinth
		Despise that which is required of you | hyacinth
		Fading out of line | hyacinth
		Step by step guide to winning a tickle war of attrition | rowan
	`),
	//ahhahahhah jokes!!
	new Scroll("Varying Elements", `
		When is a crab not a crustacean? Whenever the train reaches the station! | AI
		When is a dog not a bison? When a sheep not a horse? When a pig, a pig's tail, a pig's head! | AI
		What does the old day say? The day of the sun! | AI
		Why does the egg contain a seed? It tastes better! | AI
		What is there in black glass? Something shiny, like a glass or liquid! | AI
		What color are the stars of Jupiter and Saturn? Tears of war | AI
		Where are the old trees? We'll never know | AI
		Wait. How many ribs did you say I have currently inside me?! | tom
		Why are #my# organs making &so much noise&?!? | hyacinth
		The undulations feed your despair | hyacinth
		Roads are imaginary | tom
		The frugal will pay | hyacinth
		Agreed much, I just thought it would be fun for a few | tom
		They seek friendship, why would they be so foolish | hyacinth
		You don't get the refractions until &next& week | hyacinth
		I've been taking my new prescription. I really wish doc would've told me about the strings! / &muffled laughter of a comedy routine, at a joke you can't seem to understand& | tom
		Wooooooooo! Sig-ni-fi-cance! | tom
		UV resistant adenine!? What an idea! &chuckles& | hyacinth
		How many days does Alice need raisins? Fear out of Jive! | tom / hyacinth
		Why's the hair on &your& head? Death is a false positive! | hyacinth / tom
		My ears are begging for me to stop giving them coffee (quiet you guys! #(:# ) | hyacinth
		Quid pro sapientia - at what price knowledge? | wes
		Universal Lutefisk - fish for everyone! | wes
		Just forget about having a good memory | alan
		When is the sun not above our heads? When it approaches! | tom / shannon
		Doubles as a surreal nightmare! | molly
		Nostrils for knuckles or knuckles for nostrils? | molly
		A misconception falls down a hole into two dreary ravines. / The rabbit says, "What's the time?" / We all say, "Tomorrow!" | tom / hyacinth
		Hopelessly apocalyptic, but bound to be better by Tuesday! | molly
		Entirely undone by shenanigans, the dachshund bid adieu | molly
		Life is like a carousel, vomit inducing | shannon
		Takes out two stones with a ˢᶦⁿᵍᵘˡᵃʳ bird | tom
		Let's make the last ones be truly &excerional& | tom
	`),
	// TV and media. very good proverbs here
	new Scroll("Vocaloid", `
		There's a possibility the people from TV are from the best of both worlds | AI
		Achieve points every time! | tom
		The television is full of ""gala apples"" | tom
		Come, join the show | tom
		We're being watched and that's why our lives are so much happier | AI
		They watch and because of that you leave | tom
		Monster. Look at yourself, and despair | tom
		Hi you, pitiable creature | molly
		You are tired, tired of having to wait 20 minutes to go in front of a big tv show | AI
		Sitcom idea where it goes on for nine seasons and everybody loves the amicable characters, goofy gimmicks, and adorable romances / After a few years of this, end the show with all the characters dying in tragic manners and watch the chaos unfold | tom
		Our lives! Turned upside down in no time! Free warranty! | tom
		Our priests work #round the clock# | tom
		You will not enter {#heaven.#} | tom
		Sitting in a counter, staring at the customers | tom
		We will be going into the restaurant \\& watching people talk when they sit down | AI
		There's one last great show for everyone | AI
		Happy TV viewing, happy family | AI
		Good morning / Happy morning / Merry morning | hyacinth
		I hope you enjoy, enjoy the show of the same name! | AI
		Please have fun with this world and get together with your children, lovers, and family in this life long journey | AI
		Media in your lymph nodes | hyacinth
		If you wish, we could &all& call instead | hyacinth
		The crowd loves it when you do that | tom
		Wow! I wish &I& could cry! | hyacinth
		Greeting cards for the undead, 30% off! | hyacinth
		Technicolor bones | hyacinth
		Fully emotionally stable! As seen on TV! | hyacinth
		Side effects may include a distinct lack of purpose | hyacinth
		#Upgrades#; people, am I right? | hyacinth
		Now we have the whole $12.⁰⁰ to execute on them | hyacinth
		Your doom, for only $19.⁹⁹! | hyacinth
		These days, we squish bugs for &fun&? | hyacinth
		Wow! The ceiling is really small, doc! Doc? | hyacinth
		Achieve no points ever again. The game's over | hyacinth
		New methods of expressing one's grief were released today | hyacinth
		Top ten things that'll make you say "That's not a #hellbreaker scourge#, that's my grandfather!". You'll be wrong! | tom
		Low temporal resolution on daily activities can help to improve performance | hyacinth
		Soul crushing truths with a money back guarantee | hyacinth
		Taking a loan like there won't be a weekend | tom
		Don't let the #spirit of system# infiltrate &your& lifestyle | hyacinth
		Hey you! Why don't you try this on for size? | tom
		Have a moment? Try reconsidering your basic assumptions about the universe! | hyacinth
		Losing a game which can't be won | hyacinth
		Winning a game you simply aren't playing | hyacinth
		Like glass, but you can't empathize with those on the other side | hyacinth
		Emotional stability limit reached; please insert a quarter | shannon
		Lights! Camera! Inaction and a general sense of lethargy... | hyacinth
		Socially incompetent on live TV | hyacinth
		Reach your audience, trace them, and consume them | tom
		The spectators are &stunned& | tom
		No soul, &service& | tom
		No shirt, no shoes, no mind to peruse | tom
		The ineluctable mystery of plaid | molly
		Donate to a lost cause! | hyacinth
		...but is it telemarketable? | tom
		A website is only as strong as the weakest link | tom
		We only recruit basketball players (for the technology) | hyacinth
		They watch and, occasionally, applaud | tom
		Undeniable results evvvvvvery time! | tom
		&extra&. Know all about it | tom
		100% recycled souls | molly
		100% organic souls | hyacinth
		I do so &love& "acrostics" (see below) | hyacinth
		It's like an endless soup bowl but with our lives | hyacinth
		Join us next* week when we do something awful! | hyacinth
		Now &those& are some vital signs | tom
		Excited to exist today | hyacinth
		Believe me they're &comfortable& | hyacinth
		The premium state comes with +1 eyes. Do you have it already? | tom
		&Super awesome at menial tasks!& | hyacinth
		He's always looking towards the camera | hyacinth
		A well delivered scream | hyacinth
		Special characters denote &true& seriousness | hyacinth
		Disingenuous shock (experience) | hyacinth
		Do we want more or less points? | bodie
		Every surface in the theater is &drenched& | tom
		Woefully applauding, they left in tears | tom
		The fans are aggravated | hyacinth
		There's no "k" in display! | declan
	`),
	// math, numbers
	new Scroll("Frill Optanal", `
		Persimmons are sufficient to sustain life | hyacinth
		Persimmons are sufficient to sustain transportation | hyacinth
		Persimmons are sufficient | hyacinth
		The distinction between you and me is only 1% greater than ~99.099% of the distinction between you and me | hyacinth
		Rolling a coin 10 times will not result in 10% spades | tom
		It is gone now; you won't need to fear for about another 38 months | hyacinth
		If every event in a collection were a result of an enumeration to which it is not a result, / and that enumeration is only a sum of numbers where some element does not exist on it, and that the enumeration of the elements is only a sum (or sum) of numbers where some element exist on the collection, / we will have all the general forms of functions from which there is no natural law (unless the particular form is logically equivalent to the general form) / and the natural laws will be determined as the natural law of the universe would be | AI
		Five score, to the tenth. Business as usual | tom
		I've been adding cubes for about four minutes | shannon
		The air is warm for almost 30 minutes | tom
		A dog is not a feather, but a brick  | tom
		Gambling away across the entire range (it's about 40 or so meters) | tom
		Cozy vs. safe has a depressingly low r² | hyacinth
		There are no guarantees that there aren't piecewise laws of physics | hyacinth
		Weight is dependent on many more things than we thought | tom
		To sufficiently enjoy photons, take a break from them for a while | hyacinth
		Alcohol is optional when in the presence of statistically impossible cacao | hyacinth
		Taking derivatives, alone in a room | hyacinth
		Base 1.89 | tom
		We're just gonna end up going back to the 3.5 | tom
		Column numbers in strange contexts | hyacinth
		Tree limb to bird ratio | tom
		860! We're almost done fabricating nonsense | hyacinth
		Stop thinking you're more special than anyone else. Infinity isn't larger than infinity | tobyn
		Angular velocity &never& caps out, unlike special or quantum velocity | tom
		A top-down view of the infinite | tom
		A highly unreasonable quantity of hands to be found in 1-2 cereal boxes (at most 5 would be fine!) | hyacinth
		A bottom-up view of the finite | hyacinth
		We may have doubled, actually | hyacinth
		The maximum is 8, obviously | hyacinth
		Moving from place A to place א | hyacinth
		Statistical probability* of an eye | tom
		Eyes in the jungle | tom
		Eyes in an empty lot | hyacinth
		Hidden in the underbrush / Hidden in the asphalt | tom
		Dividing 3 by 5 can give unexpected results under these "circumstances" | hyacinth
		In metaphor, the average corn harvest is 15 | tom
		I prefer Water 7 | tom
		Ordering chicken 65 à la carte | tom
		SUN for 150. AAN for 80. MOON for 10 | tom 
		A collection of -7 items | hyacinth
		Dilute the absolute | tom
		Increasing numbers, mildly | hyacinth
		The sum of constitution, if you will | hyacinth
		The bag is incidental to the items inside the bag | molly
		Consider the likelihood | molly
		Home grown numbers | hyacinth
		One eighth: fraction? | tom
		Two of A is equal to B, ignoring their stark differences | hyacinth
		Full of accuracy | tom
		Don't &you& feel the data? | tom
		Approximating the obvious | hyacinth
		Completely independent (but it's a lie) | hyacinth
		Your percentage is growing | hyacinth
		A healthy brainbeat of 6,200 | tom
		300.24q = 1wM | hyacinth
		A couple "9 and a half"'s | hyacinth
		Concerningly low prevalence | hyacinth
		Their precision is unfathomable / Their accuracy... not so much | hyacinth
		2 may be a challenge, but 30 is a piece of cake | hyacinth
	`),
	// things theophrastes would say, high tier stuff, lore
	new Scroll("Theophrastus", `
		An awful mess, you've created. Reincarnate please | hyacinth
		A rapid transmutation and a day off | hyacinth
		Atmospheric noise and the meaning of life | hyacinth
		A home invitation and a sharp decline | tom
		Polarity and a &nervous breakup& | tom
		Sharp objects make it all stop turning, for a little while | hyacinth
		Salted is thy bread, beholden of the tides that bind | tom
		Only place your faith in falsehoods | hyacinth
		The world is fastened directly to your abdomen. You don't need an oyster | hyacinth
		The world is mine and mine alone / Go, get a new name, for it is mine | tom
		I am your only refuge, your only god | tom
		Feel the wrath of your only refuge | tom
		The people that speak is our minds and dreams | tom
		Half a rock, thrown across the bank. It's finally done | tom
		And we never would again | hyacinth
		Ifcara reached past her domain, idle minds breed reaching fingers | tom
		The gauntness of her philosophy is repulsive, although with compelling implications | tom
		You need to feel bad after you read it | hyacinth
		Our minds are too stringent for our own good | hyacinth
		And that's what it is / That's all it is | tom
		Now tip the vessel and bathe | tom
		Life by sharp edges and hard corners | hyacinth
		Falling to early and too fast | hyacinth
		The earth is getting unoriginal as the end nears | hyacinth
		And maybe it'll be okay, maybe it'll be worse than even projected | tom
		To live on your own (which may or may not end) | tom
		Praise, and you may decide your own future | tom
		No one is ever sure | tom
		I think god was getting a little wild | declan
		God's favorite color | tom
		No. You focus | camden
		To know or to wonder? | tom
		By the time I leave here tonight, everybody will be as mad as I was earlier | smith
		We are retracting | tom
		Animate your demons | hyacinth
		A glass of water for Zeus | tom
		Zeus doesn't like the idea of your promotion | smith
		The stars have aligned into the shape of your future! It's a clear day outside | tom
		Nearly comprehensible, on the brink of competence | hyacinth
		I can't even see why knowing would be helpful! | hyacinth
		Threateningly fancy | hyacinth
		The striped being gestures. Slowly, your form crumples | tom	
		Overcapitalizing as to not Displease the King and Court | tom
		God is not a figure or object | hyacinth
		It is not the one being worshipped, no matter how much it wants it | tom
		I am the one being worshipped | tom
		Look to the heavens, bound in despair / You cannot address these bindings until you have done so to those within | tom / hyacinth
		God of the palm of your hand | tom
		Observations are acts witnessed by god | sofia (t)
		You are just a free sample for the gods / You will be picked up with a toothpick and eaten | tom
		Go, speak to yourself for I shall not hear you | tom
		Consciousness is a pipe dream | hyacinth
		I try not to make decisions with consequences | hyacinth
	`),
	// strangeness, moss/plants, good
	new Scroll("Auberations", `
		It happened on a Tuesday | tom
		♪ I &can& hear &you& ♪ | hyacinth
		Ordering "moss on the rocks" at a bar | hyacinth
		The country people are quite picky | tom
		Moss is [emotion here]. Now, moss is a philosophy | tom
		To see is to believe, to feel is to doubt, and to smell is to be thoroughly disenchanted | hyacinth
		The feeling of being able to feel your voice in the woods is lovely | tom
		My soul feels so crisp at this time of night | hyacinth
		What the hell did I think I was gonna hear this on the radio? | tom
		It's fun to watch y'all manipulate others | shannon
		The packing peanuts entice me | tom
		Flora, Fauna, and the Fabiform Father | shannon
		There's also a little part in this episode where Liz points out why you shouldn't get rid of all the gods at once, so how does that make people unhappy? | AI
		There have always been a couple rogue linguists | hyacinth
		Make staying-alive-style choices | hyacinth
		The extended metaphor may &never& end | hyacinth
		The desire to imitate beauty is &grasping& | tom
		The stadium is full of moss | tom
		The whole stadium is &full to the brim& with moss | tom
		The ground is alive, in a non-ominous way / It goes down farther than you could dig | tom
		[Name] and [name] are the last ones on this planet | tom
		hyacinth, cindy for short | hyacinth
		Going by "synth" at a grand piano convention | hyacinth
		The essential combat botanist | rowan
		Mist is my favourite flavour of summer | hyacinth
		The moss feels annoying, overdone, derivative | hyacinth
		Try empty voids and epic poems instead! | hyacinth
		You're my moss (affectionate) | shannon 
		The ferns spotted fingers and tickled the toes of all who walked by | molly
		Do you feel your breath today? | hyacinth
		I'm spiraling down to the ferns of my soul | wesley
		The biodiversity of a plane does not denote its habitability | tom
		Cold, cozy plants, resting at the bottom of the pit I call home | hyacinth
		Grass in the alleyway | hyacinth
		Dragonflies make good steeds if your friend is a tree | rowan
		Dishwater consumption is based on morals, or lack thereof | tom
		Slide down the carrots for a fun time! | wesley
		Fully "organic" / Not even remotely stolen | hyacinth
		A moss-covered everything | tom
		The metaphysics of plants beguile us all in the end | molly
		Strips of moss dangling from the heavens | hyacinth
		Finely minced forests | tom
		Close enough to a soul to work | tom
		The second best thing to replace a spirit | tom
		The closest thing to a body you'll ever get | hyacinth
		The package is "damp" | hyacinth
		Keep them dry | tom
		They grow in the bathtub | tom
		My ears feel crisp at this time of night | hyacinth
		Now you know where the flowers | tom
		The plants speak nothing of their annoyance | ryan
		Keep them submerged 'til they're ripe | hyacinth
		...I may have committed accidental propagation | shannon
		You can't even know how many cells you have | tom
		You just made every tree in this forest an inch taller | tom
	`),
	// cards and games. study of the universe. science
	new Scroll("Boron's Knautsawn", `
		The king of spades is mad at you | tom
		You've been dealt a hand of a king of spades and an ace / That would be great for blackjack but this is five card draw and you seem to somehow have lost three cards already | tom
		The cards* are being dealt | hyacinth
		Oh, you &know& what they want | tom
		&The dealers are ready& | hyacinth
		Now play your hand | tom
		Infinite stacks of pale green paper (it isn't money) | hyacinth
		We exist in the space between brain and mind | tom
		The ability to distinguish between smoke and mirrors will be invaluable | hyacinth
		The trees are but daughter nature's haphazard attempts at drawing a triangle | hyacinth
		The whole reality is a game of skill | tom
		That's just the real world | tom
		Reality tears aren't two dimensional, despite what the authorities say | tom
		Playing cards should be worth more. You could try and collect a full deck | tom
		Exuberate yourself | tom
		Do even think about it! | hyacinth
		In the third spatial dimension, there is North, South, East, West, Posck, and Whick | tom
		In the fourth spatial dimension, there is North, South, East, West, Posck, Whick, Deach, and Gokch | tom
		Blind mapmaking has created new, difficult to explore realms | tom
		A semblance of reality | tom
		Tuning the gears allows &proper& thought flow | tom
		I don't think they can hear you. Not yet anyway | hyacinth
		Don't let the devil give you a choice! | AI
		Saying "No thanks" to the devil only makes you look bad! | AI
		Your reflection is not yours to keep, it is simply borrowed | tom
		Mirrors have a wide range of customer reviews | tom
		It's a bit cliché, this life | tom
		Out of the fact, we transcend | tom
		You think &that& will save me? | tom
		Several deities inhabit your attic | hyacinth
		That's very &mauje& of you | tom
		Former, latter, and arnter | tom
		Positive, converse, inverse, contrapositive, and pollative | tom
		Was everyone created the instant the universe was? | tom
		More likely our being sprung into existence sometime after the conception of the known worlds | tom
		Many were possibly created at a single instant, however, to account for the extreme lack of overpopulation, / Either true death is possible, new worlds are still being born, or the theory is incorrect | tom
		If the latter theory-abiding concept is to be held as truth, the size of this universe must be staggering| tom
		How can such information be held? | tom
		If the former, then where are the boundaries of these worlds? | tom
		If true death is possible, is it balanced or will we go extinct? | tom
		Think or be thought | declan
		The Knautsawn was constructed, in mind at the very least | tom
		Drawing a card from a standard 40 card deck / It's &your& future | hyacinth
		Fire, water, cloud, air, stone, and the invisible heuristic | tom / shannon
		Air, Wind, Sky, and Atmosphere / The four elements surprise some... | hyacinth / tom
		Nothing but the sand you came from and will return to is free | tom
		Alone in a randomly generated landscape | tom
		Curiously, intellect and flammability of the body appear to be linked | tom
		A common copper tube is all you need for this one | tom
		Although concerning, the variation of particles seems to be stable | tom
		Pawns, both Towers, both Judges, Prophets, Seamstress, King and the Sun, set upon the board | tom
		How to stow a conscious form | hyacinth
		Ambiguity conquers antiquity | tom
		Quality triumphs over ambiguity | tom
		Antiquity begets quality | tom
		19 out of 20 times, the body wins | tom
		No event is independent | tom
		Faith is for those who have chosen to forget | tom
		Sewing is a way to talk to the inanimate | anna
		Threading the needle through #thick# and &thin& | hyacinth
	`),
	// sea and salt and food
	new Scroll("Kelp", `
		Salt in the sea brings you to your knees | tom
		It is not dependent upon the inclusion of fruit | ryan
		Loops upon loops | tom
		There's nothing but more humans and they're just as confused as I. Where is everyone else? | tom
		Looking around: are we all grammatically correct? | hyacinth
		Joy is a boundless restriction | tom
		From riptides to modified polypeptides, the sea claims all | tom
		I value sleep with cities and salt | tom
		The habitat is no longer safe. Maybe it never was | tom
		I came for aspirin but I wound up with chocolate | wes
		The powdered joy too often comes out in clumps | molly / hyacinth
		My brain has been clogged with hair and the serotonin won't drain | hyacinth
		Some regions of the brain are likely to be burgled | hyacinth
		Singular. Drops. Of. Water. | hyacinth
		Fish on the land. Sky in the sea | tom
		Fish on the window | hyacinth
		Those in the windows / These in the trees | hyacinth
		Any time, any place, amidst the sea, it's all the same | hyacinth
		Mirrors have varying levels of reflection | tom
		Solid food for infant mermaids | hyacinth
		Out of steam, out of mind | hyacinth
		A surfeit of organs; human, no less | hyacinth
		The ice cream screams for salvation | hyacinth
		We can bounce things off the moon to send plain text messages between chairs at a table, so where's my ham \\& cheese?! | hyacinth
		As a person who lies / I eat the gelatin | hyacinth
		Once, when figs fell from the sky and dazzled with their bioluminescence... | molly
		The cauliflower danced a jog and sparkled in the gloaming | molly
		The seaweed is running rampant, right now, in the wake of the ocean gardener's strike | molly
		Just a whole lot of curry | hyacinth
		An apotheosis of pickles | molly
		"Would you like a side of flies with that?" | molly
		Cauldron without stew | tom
		The carrots try their very best and yet they still disappoint | tom
		Avocados' origin story: when a pear seed suffers a Messiah complex | molly
		We could eradicate custard, but where exactly would that leave us? | molly
		Negative calories in strings | tom / hyacinth
		Negative salt in a watery world | tom
		My seat belt is growing algae | shannon
		Combining beans in unforeseen and possibly revolutionary ways | hyacinth
		A warm cup of nice, salty ki'e | tom
		The water's purple in the paling sunset | hyacinth
		What is the line between a sample and a meal? | tom
		An overdose of sᴀɴᴅ | hyacinth
		Hello. We are all feasting | molly
		Fruit of your fruit tree | tom
		Strictly healthy items | hyacinth
	`),
	// ceremony instructions
	new Scroll("Ceremonisms", `
		Humming and warring | tom
		They arrive in many turns | hyacinth
		Take up a new hobby. You'll have to, eventually | hyacinth
		Lock your doors, open your windows, and call upon your neighbors | tom
		You will go and I will follow, in my own twisted way | tom
		Intertwined, measurably | tom
		All light is simply a byproduct of your own twisted constructions | tom
		Identical depression and twins | tom
		It's nothing personal | hyacinth
		Home is where you play open handed | hyacinth
		Peanuts are likely to have tiny hats | declan
		A bearded man is present within the legumes, if only you choose to find him | hyacinth
		A man is coming out of the oven | tom
		I feel I know everyone and nobody | tom
		Myopia is an inadequate foundation | hyacinth
		The fibers have prevented your self-realization | tom
		Don't forget \\& don't remember! | AI
		A strong, ancient voice calls to the world | tom
		The metal helps more than it hurts | hyacinth
		Draw the curtains on the sky to let the powers that be slumber | hyacinth
		Throw open the earth and free those below | hyacinth
		The lil' guy is all wound up | hyacinth
		And the uncanny Illumit befell upon the city and the twisted bowl was a false protector / The dwellings crumbled like those within and the twisted bowl filled with blood | tom
		Instrumenting your wishes | hyacinth
		The best part was there wasn't just one | tom
		Master your worst skill on the weekends | hyacinth
		A dignified prophet, Pht., if you will | tom
		Generated\\/gathered for various purposes | hyacinth
		Praying for departure requires octagonal perambulation for the best results | hyacinth
		Lock your doors and windows, hide in the basement, and wait for someone to arrive | sofia (t)
		Hiding in the basement / run from their glance | hyacinth
		Oh, the keys they burn / Please cool your keys before preparing the ritual | declan
		Unexpectedly, we congealed | molly
		Your papers are lacking the proper signatures plus a certain je ne sais quoi | molly
		Overcome by an influx | molly
		Morally ambiguous "you" | tom
		&Now& you're alone. It'll be over soon | tom
		I have the key to your ribcage | tom
		The beast's reflection is subtle, but comforting | hyacinth
		We can discuss later when I'm less purist | tom	
		We're to become cultural values | hyacinth
		We go to bed and floss our minds | ryan
		A pilgrimage to the ground | tom
		Pros of being buried: #&dirt&# | tom
		Running towards your next life! | tom
		We're just prophets for a godless religion | tom
		Locked up and damned souls | tom
		Hallowed be the hearts of earth | hyacinth
		Impending age / Incoming sage | hyacinth
		A jail for the mind while the body roams free | tom
		They sung a hymn for a peaceful next life | tom
		Corpses are 97.05% &hydration& | tom
		Your shadow may leave for a time / You will accept this | hyacinth
		The sun actively racing towards the ground | wes
		The trouble is, some people don't &need& the drugs | smith
		Toiling and tumbling, up and down | hyacinth
		No afterlife = No beforelife? | tom
		Ancient domains rumbling below | hyacinth
		Scrying the bioluminescence | molly
		They don't just extract the blood (exasperated) | hyacinth
		Eye removal techniques (ecstatic) | tom
		They just die when it's over | hyacinth
		A murmuration of priests filing through the walls | hyacinth
		The hands are striking | hyacinth
		Remaking your bones for a stronger statue | tom
		Resurrectionism and the inhuman forms | tom
		Sometimes the structure calls us near, mourning | hyacinth
		Invisible to any eye you can muster | tom
		Hiding outside in the &other place& | hyacinth
		Strolling through &their& area | tom
		Running through "my" area | hyacinth
		Hiding in places you should be hiding from | tom
		Graffiti on your hands and eyes | tom
		Don't eat 'til it's over | hyacinth
		Bits and pieces of your heritage | hyacinth
		No? Then I'm gonna look more at that strange diagram | hyacinth
		Truly a shame; they've never been open. Ever | tom
		Every inch is still, but you're definitely still here | hyacinth
		I refuse to speak any longer for it is getting full | tom
		You know all my favorite sins | tom
	`),
	// disconcerting ones, void/emptiness
	new Scroll("Splines", `
		Scream, for they can hear you / Sing, for this is literally a recording studio | hyacinth
		Splines cannot have hurt you | tom
		Crucially modified organisms | tom
		You must not be italicized | tom
		Passages through the void, find nothing else | hyacinth
		Pulling through the dark zone is... unadvisable, though definitely encouraged extracurricularly | tom
		As long as you're off the premises, we can't stop you | hyacinth
		The void wishes for your company (the feeling isn't mutual) | hyacinth
		Scream against the void that is your friendship | hyacinth
		Don't look them out the eye | hyacinth
		Accurate predictions strain the system | hyacinth
		You shan't see anything of significance if you look | hyacinth
		Invisibeast | tom
		But your mouth does not open | tom
		You set down the weight and your shoulders feel heavier. You could have predicted this | hyacinth
		The load you bear is not yours to release | hyacinth
		The alternative versions of the present are your favorite | hyacinth
		Sentient; Thoughtful; Afraid | hyacinth
		Your temporally negative doppelgänger is likely a bad judge of character (especially yours) | hyacinth
		Your temporally positive doppelgänger is limbless | tom
		Your soul (it stings) | hyacinth
		OctoDachshund | molly
		The spirits hush my voice / I scream, but I cannot | tom
		Rice voids, emptying spaces you could use | hyacinth
		Stop trying to outrun the void you leave in your wake | hyacinth
		Yell into the space you cannot feel (only when you feel lost) | hyacinth
		The ever-shrinking space around you | hyacinth
		The chasm is closed to visitors today. Try again tomorrow | molly
		A quiet acceptance of the void between my ears | hyacinth
		Voids in the family room | hyacinth
		Sorry I'm late. Traffic jam in the void | molly
		♩ Just because we don't know what we'll find when we get there, that doesn't mean we shouldn't run ♩ | hyacinth
		Yodeling into the abyss | molly
		Smiling does not necessarily denote a good person, or lack thereof | tom
		Consider a chasm, filled with Spam | molly
		Recycle your body so we can crystallize the sweet sodium inside | declan
		Cold strands of your mind, leaking and dripping from a slit in your forehead | hyacinth
		The web of lies is created by the spider of inconvenience | declan
		Sculpting the mayonnaise into a form resembling emptiness | molly
		The scorched earth is still alive | tom
		Scars on the walls, blistered and burning | tom
		A plethora of useless toys | tom
		Your daughter is beautiful; fossilized | shannon
		Ribbed walls, tracing your mind / Drip. Drop. Drip. Drop from the ceiling as you start to break | hyacinth
		Depressingly lemon | tom
		Uncomfortably lime | tom
		Wow! Such ᵃⁱʳ! It ˢᶦˡᵉⁿᶜᵉˢ ᵐᵉ! | tom
		The windshield is cracked and the car is rapidly deflating | tom
		Your hair is easy and soft / Permeable even | hyacinth
		The superficial having of hands | hyacinth
		Drawing the witch closer | tom
		In fact, you knew your own reactions | tom
		Purple is the primary color | hyacinth
		Hives in your open-shaped organs | tom
		"It screams" | tom
		Rearranging and adding to your bones | tom
		Honey fills your lungs with buzzing | declan
		The head is an odd choice for the brain's hull | hyacinth
		The creatures are coalescing into and outside of the cocoon | tom
		Everyday screams / Frightening smiles | hyacinth
		I am them, but they don't know that | tom
		A truly disconcerting comparison | hyacinth
	`),
	// instruction, emotion, feeling, slightly disconcerting. good proverbs
	new Scroll("Winding Respirations", `
		Luminance and the ethereal, it flows beneath | tom
		The undercurrents of our consciousness are blue-green and roiling | molly
		Don't mask what you can't see | tom
		Pretend you aren't breathing | tom
		The seashells are strewn across the counter. If only this could last | hyacinth
		What's on the counter | hyacinth
		Nothing amidst the fluid carries the answer | hyacinth
		As you fall, look behind you | hyacinth
		And I was watching as it suddenly changed | tom
		They shift subtly when you aren't looking | hyacinth
		Walk 'til you can't run anymore | hyacinth
		Close your eyes and just breathe | tom
		Lose yourself and find others | hyacinth
		If I can get that antique to work... | tom
		An altar? Never knew they existed | tom
		Altar more like alter | tom
		The feelings are enumerable | tom
		Personal feelings, growing out of bounds | hyacinth
		How many shells gathered? How many more? | tom
		The death of Pleo-Jovia | tom
		The pipes don't serve the people | tom
		Now &you& know what the deal is | tom
		Here is where the heart is | hyacinth
		Don't fear what can't be broken | hyacinth
		Tendrils of emptiness snaking around your broken body | hyacinth
		"Alive" is more a spectrum, rather than a binary value | tom
		I wish to be treated as a descent into chaos | wesley
		Feeling an emotion twice at the same time | tom
		One too many emotions, I think | hyacinth
		Emotions: buy one, get one free! | molly
		Inhuman Intellect #will# deceive you. Please leave your emotions at the door | tom
		Altars and doorways are synonymous | tom
		Evaporated emotions on the spotless mind | tom
		Roaming the terrain of antiquity | hyacinth
		IH: Inhabitable / SH: Sparsely habitable / MH: moderately habitable / H: habitable / E: exceeding | tom
		They can hear your shock | hyacinth
		Go on, drink their life force | hyacinth
		Throwing the gears in the recycling | hyacinth
		We can't promise that you'll see the end | hyacinth
		Can't hear what's going on | hyacinth
		See &exactly& what you see | hyacinth
		Unknowingly distressed at the possibilities | tom
		Every pebble and grain of sand you see has been expertly sculpted by us | tom
		Stunning "compassion" | hyacinth
		Abnormally considerate | tom
		Climbs violently up moral high ground | hyacinth
		The arena is &flooded& with tears | hyacinth
		They draw ever nearer | hyacinth
		They are listening for recreation | hyacinth
	`),
	// disconcerting, death, blood, liturgy
	new Scroll("Liturgical Lifeblood", `
		The patchwork is incomplete | tom
		The guests have been locked | tom
		If you're worried, then examine the glass, the grass, and the breeze | tom
		No one among you can understand the gravity of what you've done | hyacinth
		Wicker lanterns, dancing 'til there is nothing left but light | hyacinth
		The fruit smiles, your time has come | hyacinth
		Why must they anger us so | hyacinth
		The road doesn't work ahead. Stop hoping | hyacinth
		There is always time for flexibility at the end of a candle | hyacinth
		You're viewing it in the wrong dimension, you goofball | tom    
		The nature of empathy leads us to deny it | alex
		A small fraction of you may end up happy. Although it means no harm to you, many of you want to leave | AI
		Step into the magnet machine and feel your #blood# | tom
		The weight of emotional release will be passed on to someone else | tom
		When one moves briskly, the air will freeze on their hands | tom
		Your breath illuminates the things you try to ignore about yourself | hyacinth
		A scathing critique of the faithless | hyacinth
		Hear them walk through the halls | hyacinth
		Pretend that didn't happen, if you want to keep your skeleton &within& you | hyacinth
		They were four long and four wide, with varying heights. The volumes were all the same | tom
		Pouring is easily done, more so with skill / One skilled at this is quite a sight to observe | tom
		I'm going to take a census of your blood | tom
		Put on your &blackout gear& | tom
		What the sturgeon lacks in literacy and liturgy, in makes up for in antiquity. And whiskers | molly
		Bloodshed shall sweep across the kitchen | declan
		Atmosphere of glass | tom
		Feeling the glass in your throat | hyacinth
		Fabric woven from soul fibers | hyacinth
		...well ...It could have been your blood | declan
		Candles; a fragrant way to burn your house down | shannon
		Shattered in fire, built in the souls of the hallowed | tom
		Forcefully making my heart beat | tom
		Blood and tears for the flower | tom
		Unformed eyes | tom
		Oh, and how they burned away anything imperfect for it was sinful? | alex
		Pearls from the minds of the deceased | tom
		Blood loss is as blood loss does / &Bad& | tom
		Papers in the gaps | hyacinth
		Like death, but you stay with us | tom
		They will predict your death with great accuracy | tom
		Experiencing murder (but from what end?) | tom
		Nothing else to do but use the flannel for fire | tom
		Fire to feed them and the children | tom
		Husks of the soul | hyacinth
	`),
	// neptune and their wisdom and wide instruction, water
	new Scroll("Neptune's Quenches", `
		Lost in specificity | hyacinth
		Putting on a shirt the way others wear a soul | hyacinth
		I had a dream where all my dreams came true | tom
		Sometimes fits of arise | tom
		Predictions are a thing of the past | ryan
		If the sky is original, the ground holds possibility | anna
		That may have been a deception | hyacinth
		Just keep doing this forever and you'll feel awfully mediocre | hyacinth
		Doing nothing is not a substitute for living wrong | hyacinth
		Diving into the known to find out what you need to forget | tom
		The choice of being me over you is one that I will choose | AI
		Your identity is only as strong as your willingness to leave | hyacinth
		Pretend you are an aglet. Now stop, please. Tell us your experience | tom
		Neptune stretched their cloaked fingers and it was done | tom
		They bathed in the new light of the Illuminating | tom
		You feel the air settle around your shoulders; you are at peace | hyacinth
		The tears run up your face as you lose your voice | hyacinth
		Neptune awoke on the beach, but they were not conscious. Nobody is | tom
		And the night looks on, bemused | hyacinth
		Telling them why they can't breathe is exhausting | hyacinth
		Anything is organized with the &correct& perspective | tom
		I haven't &ever& seen you this young | tom
		Only false gods lack domains | declan
		Narcolepsy is an effective method of transportation | tom
		You must speak before truth is possible | hyacinth
		Boron, he thought death was optional | tom
		You can't ever really be &dead& dead | tom
		You wear death but you haven't known it for a while | tom
		Don't remember last time? | tom
		Please let me sleep, I promise I'll dream | tom
		The copper turns green and the iron turns red in an instant | tom
		Iron rusts, copper oxidizes, silver tarnishes, and you persist | tom
		The correct tools shatter the most persistent of knots | tom
		Finding yourself in an empty room | hyacinth
		Subsumed by the uncanny serpents | hyacinth
		Radio signals in a desolate landscape tell me just how far I am from home | tom
		Rain in an instant | tom
		Mayday! Mayday! We are awake | hyacinth
		Resting on a copper plane | hyacinth
		Take the fishing boat out only after 2 am | anna
		Undesignated bodies / warm, high, n dry | tom
		I'll be back soon, in a matter of speaking | molly
	`),
	//stones
	new Scroll("Ossuary's Fingers", `
		A touch is not a stone | tom
		The last step is to bring the stone into the furnace | tom
		You do not remember the stones | tom
		The stones welcome you into their ranks | hyacinth
		The stones hold memories and cradle them, softly but firmly | ryan
		The stone keeps watch on you and your future | tom
		The stones guide you through the valley to a new life | tom
		Stones encrust your skin | hyacinth
		Minerals amidst your veins | hyacinth
		Stones offer protection from the sun and you are always at peace | tom
		And you are still a stone | tom
		Driven from your home, the stone-lined path guides you to your next | tom
		They must not realize what this stone arrangement meant | tom 
		The stones contribute to the rigidity of your knuckles and vertebrae | hyacinth
		Backstones | tom
		Never leave a stone unturned, but beware its inertia... | hyacinth
		The stones will encourage you to leave, &soon& | hyacinth
		Gems were found as their last resort | anna
		The nobility held the gems captive | tom
		Sealed salt for use as decorative stone | tom
		Stones spiraling slowly towards the gate, peaceful and solemn | hyacinth
	`),
	// singularity
	new Scroll("Aplicality", `
		A single grain of milk | tom
		An entirety of a bird egg is but a shell | tom
		They are right, for they come from below | tom
		They are left, for they come from above | tom
		Only look down | hyacinth
		A word is worth exactly three sevenths of a length of string, as determined by the latest census | tom
		Drifting with a single strand | tom
		Barely one of us left | tom
		You are now one of these two souls | tom 
		Fugue in the deepest of nights | tom
		Everyone &else& is a figment | tom
		You are a figment of your own imagination | hyacinth
		The whole can be defined as singular | tom
		One frame of life | tom
		I have a soul? You've got one of them! | hyacinth / wes
		You're only #Born# once (not to be confused with "born") | tom
		Opticular ones? Don't exist | tom
		The moment! Here it comes... | tom
		Precisely one debacle | hyacinth
		Exactly one tad | hyacinth
		That's a real thing | declan
		Units of sustenance | tom
		I am a cell in a bigger body | ryan
		First day my next life | tom
		Plus one days! For you | tom
		Maybe a raincoat | molly
		A singular knive | hyacinth
		We've successfully and without harm added a particle to this realm | tom
		It's TINY, but it is ʜᴜɢᴇ | hyacinth
		Decaying in a lonely chair | hyacinth
		This road is only subtly different from a trail | wes
		It's been goin' on since day one | tom
	`),
	// sun, cycles, duality
	new Scroll("Shifting Ties", `
		We keep our gnomes around for the season | tom
		Look how long that hat is | tom
		Glasses and glasses of things ever stranger | hyacinth
		Heartbreak and insanity often coincide for crustaceans | hyacinth
		Nothing you say can or will be used against you in a court of law | hyacinth
		You keep forgetting that you are confused | tom
		It is a seething celestial mass, weeping silently as it circles our little home | tom
		The limits of the tree are infinite, albeit two dimensional | hyacinth
		The stars will be caught up soon! | tom
		There is the soil, there is the stone, and there is something below | tom
		There is the sun, there is moon, and there is something else | tom
		This is paradise, and our existence is one more time to die | AI
		You wouldn't feel it if it were right | hyacinth
		I wish the letters would manage the din | hyacinth
		I don't think it's healthy | hyacinth
		Continents are meant to be broken | tom
		Still looking for the center of balance / Averaging the component parts hasn't worked since I was a kid... | tom / hyacinth
		You knew what I was going to do | hyacinth
		Slightly off-kilter diction where you thought you'd see advice | hyacinth
		Somos todos seres cujos átomos são lembranças - irónico, não? | gabi
		WOW! You have a SUN | tom
		The sky is creative, despite the sun | tom
		Despite all we'd done, the sun rose again | tom
		Your head rings with the light of a thousand suns | hyacinth
		There's a single thought connecting two of you | tom
		He had eyes of diamond and metal. A heart of gold and rust | tom
		You #know# nothing happened | tom
		Trip today, not tomorrow | lucas
		Stay within the patches of sun | tom
		Sun and soul / Reflecting the sea / Waiting in time / For powers to be | tom
		Hanging by your last strings, you rise. / A flower does not grow to be cut / A book is not written to be burned / You stand / Not to get your strings cut / but to put things ri... | tom
		She's the creator of this intrepid and lonely homestead | tom
		A handful of mysteries add that little bit extra to this universe | tom
		Your eyes / You look / They stutter / You collapse | tom
		Whipped wind and a good feeling | tom
		The rind of the husk of the crust of the day | hyacinth
	`),
	// ...'s and random characters and things that dont make sense
	new Scroll("Freud the Spinner", `
		A book is ㅋ | AI
		I“ʘ I don“x“? Yes | AI
		Ankh per size but not a length | tom
		Ankh per width the depth of ships, amidst the life and death there is | tom
		Ata khe ata! | tom
		Edge on edge! | tom
		Dog is lode | sofia (t)
		Escape! Escape! &Escape!& | tom
		Scrolling past trees and breeze. Like, y'know... | tom
		I am not that type that can write scripts, I am just... | tom
		*aerates quartz* hmm, yes... a hint of walnut | hyacinth
		Please press 'Enter' | hyacinth
		We &always& hold 'Shift' | hyacinth
		Ipi, Di'a, I'a'ti, Kat'a, O'po'li, Si'o, Si'e, Si'un, Ker'o | tom
		B3t u d1dN"t s3e {#this.#} com1nG. rUn t0day and CAㅋL "today" | tom
		warrant a play a ▄▀g▄▀a▄▀m▄▀e▄▀ | tom
		▀▄g▀▄a▀▄y▀▄ on a rainy day | hyacinth
		Clocks on the walls / Clocks in the halls / Clocks in the stalls / Clocks in the shawls / Clocks in the hauls / Clocks... | hyacinth
		...in the Malls | hyacinth / tom
		Clocks in the Xalls | hyacinth / tom
		...as you fall through the sand | tom
		Oh, to be an idiot in a castle | hyacinth
		Bricks? Bricks! Many for a penny | hyacinth
		A die in glue | hyacinth
		Wow! It glistens! | hyacinth
		Stripes on stripes on stripes! I see my #soul# | hyacinth
		An #&iota&# of unjust circumstance!? | tom
		Sweetly anachronistic, if nothing else | molly
		tHE cYLINDER hAS bEEN rMOVED? | tom
		Lost! In the liiiiiibrary | tom
		S- S- Sliced! | tom
		...and they shall be gracious | tom
		Now t-t-t-that is what w-w'''ere here for! | tom
		I CAN'T HAVE ANY UNIQUE THOUGHTS IN THIS ROOM | hyacinth
		Asterisks of inaccuracy | hyacinth
		#T-t-t-t-two# spheres in one! | wes
		ᵍʳᵉᵃᵗᵉʳ ᵗʰᵃⁿ, &greater than&, greater than, #greater than#, ɢʀᴇᴀᴛᴇʀ ᴛʜᴀɴ, #ɢʀᴇᴀᴛᴇʀ ᴛʜᴀɴ# bold! | hyacinth
		Hello?! The earth?! Hummus beneath our feet?! | molly
		Vibrant lights / Sparkling in the night / Ever after we sleep / Die. | hyacinth
		Motes in the air / hair in the sky / Fly in the sea / Be for an eye | hyacinth
		The field in your shoes | tom
		Psychiatry* will save you | tom
		Σodra D7dug was a being created of coincidence and intention | sofia (t)
		Paper: ready. Poets: liiinnnned up. Solution: infallible | tom
		Personally, it's no(t|w) a decision I would make | tom
	`),
	// landscapes, new location
	new Scroll("Exlareel", `
		That was an awful "place". I was there | shannon
		Oh dear! I'm so sorry you had to see that! ᴠɪᴇᴡ ɪᴛ ᴀɢᴀɪɴ | hyacinth
		What a time to be Alice | tom
		The questions you ponder shall remain | hyacinth
		Parallax universe. Don't be so sure of existence | tom
		Gaze upon the wasteland before you and know your place | hyacinth
		Avenge the risen, for the fallen have come too far | tom
		They let you come here. Don't mess up | hyacinth
		Do your very best to make the first good action you take not be your last | hyacinth
		Consider the distance you must fall to reach the sky | hyacinth
		Where can you find several oysters? | hyacinth
		Ghostwritten acknowledgments | hyacinth
		Typography is going to be a surprisingly lucrative profession | hyacinth
		A pilgrimage to the end of the road | tom
		Wildflowers and open hillsides / Heights beyond that which is below / and a soft breeze | tom
		The zoo is expanding, far beyond its proper limits | hyacinth
		You leave your homeland at least once | tom
		Such an earthly world | tom
		Places to meet and people to be | hyacinth
		Moving on to new realms and new days | tom
		Seek what is beyond the hill | wes
		So close to the end of the road, but the pavement's getting warmer | hyacinth
		Highest tier items in a collapsing home | hyacinth
		Missing from a place we call "enemy" | hyacinth
		I have a series of impossible wishes I've made in a little list in my mind | tom
		Brilliant blue blazes brighten heralding the end of the world | mayzie
		Comprehending the "natural" world will forever be impossible / Let's leave it at that | hyacinth
		Shaved dimensions | tom
		Domestic ordinance / Shocking depth to the everyday | hyacinth
		Swimming through the planet | tom
		The height of the earth mostly influences the red channel | hyacinth
		Causing confusion without meaning | tom
		You don't deserve the darkness between rooms | hyacinth
		*Our home in the trees | hyacinth
		Once here, you certainly once have | hyacinth
		Several bridges between the locales | hyacinth
		Home address: betwixt and between | molly
		We cannot &be& farther (exasperated) | hyacinth
		Endless columns, drowning in vines | hyacinth
		Nobody's gone beyond the boundary | tom
	`),
	// sea, dreams, reality
	new Scroll("Tidescales", `
		We, you, they, everyone. All continue | tom
		Dreams are the reality and what seems is the dream | tom
		The ships that sail the sea defy the powers that be | tom
		I am a beast of instinct | hyacinth
		A furious cocktail indeed | tom
		Circles intersecting makes the dizziness go away | anna
		Spend a lil' time in the panic room | tom		
		Don't place your faith at the start line | hyacinth
		Give up on the dreams that push you further down the gravel path | hyacinth
		Dreams within your heart will do whatever they can to break free, even if it kills you | hyacinth
		Your surroundings are exhilarated | hyacinth
		The glass is unbroken, your sleep is peaceful, and your mind spins in the emptiness, waiting for dawn | hyacinth
		Both love and smell are blind, given time | hyacinth
		Several objects can be swapped for interesting effects | hyacinth
		Your mind bends when you approach your temporal limits / twisting away from common sense | hyacinth
		Cyclic in an infinitely precise universe | tom
		You wouldn't know reality even if you died | tom
		The seal on the envelope you call home makes it easier to stop wondering | hyacinth
		Although the material isn't waterproof, the craft is | tom
		The building block of civilization is ability to ascend | tom
		Reality is currently experiencing technical difficulties. Please try again later | molly
		The cloven-hooved cod was once a deep-sea spectacle, but mediocre once battered and fried | molly
		Simply boil down your hopes and dreams | hyacinth
		Don't run from your dreams... Or your nightmares | hyacinth
		Out of real life* | tom
		And they spilled over the rocks | hyacinth
		You have never been home | hyacinth
		It will certainly try | tom
		I'm the little picture | molly
		Unbridled, dream-free charisma | tom
		Mind alight in an empty room | hyacinth
		The room is &empty& | hyacinth
		Wallet for the ocean | tom	
		Maybe they'll dream | tom / hyacinth
		Ever denser, ever smarter | hyacinth
		Such floof, such bliss | tom
		"Conscious" doesn't even begin to describe it | tom
		We cut ours out of nothing / There is no greater whole | hyacinth
	`),
	// chaos, disconcerting, high tier stuff
	new Scroll("Carnalicy", `
		You will cause chaos if you try and leave | tom
		Pulled from the jaws of real life | tom / hyacinth
		Ripped! Just like reality! | tom
		Reality is subjectively arguable | tom
		Gravity is subjectively arguable | tom
		Face the enemy, find the enemy, dispel the enemy | tom / AI
		You have died of blunt edges | tom
		I stubbed my toe on the nature of sharpness | hyacinth
		Too bad you've got 𝕥𝕣𝕪𝕡𝕠𝕡𝕙𝕠𝕓𝕚𝕒 as soon you'll be 𝕗𝕦𝕝𝕝 𝕠𝕗 𝕙𝕠𝕝𝕖𝕤 | tom
		The air was filled with silence as I stood in the middle | hyacinth / tom
		I levitated with aplomb until they pulled the air right out from under me | molly
		Even though everything is so well planned, you're going to be the next one | tom
		You're far when it doesn't hurt anymore | tom
		Many who I cannot name | tom
		You can't tread far from home | tom
		Be careful, or your permanent record will go on you | hyacinth
		A rich lode of scandal and alleged crime | tom
		Everything is being &ripped apart&! The best part is it was &hollow all along&! | tom
		If it wanted us dead, we would #all# be dead | tom
		The distinct lack of emptiness is jarring | hyacinth
		Eyes? How about conveyors of lies | tom
		Show me how it pains you so | tom
		Body language, bone language, spirit language. Collect four and you will be pursued! | hyacinth
		Where we see a mountain, they see a crevasse | tom
		Let me give your fear a form | hyacinth
		Completing your goals leaves you with no purpose | tobyn
		They're almost at the door (they just want to #talk#) | hyacinth
		Where we see a tree, they see a thicket | tom
		Growth in the off season...? | tom
		Fully grown, not nearly in time. Nothing is ready | tom
		They still have an overwhelmingly real-world theme, but it's getting better | hyacinth
		Entropy kisses and kills us all | tom
		Ordering phalanges à la carte | tom / shannon
		It's like laying knives on the kitchen floor | hyacinth
		The more you scratch the more pebbles come out | declan
		Woolen beasts of great demise | tom
		Slithering, sliming, climbing to victory | hyacinth
		It's like dinner, but without the food and only knives | shannon
		Static outside of your front door | hyacinth
		Knives for the weak | tom
		The consommé of souls was bright and clear but woefully insubstantial | molly
		Leave your body to the food bank in your will | hyacinth
		The cables are pythons and you are a trapped animal | declan
		Fighting the urge to release one's soul back into the wild | hyacinth
		Approaching the far | hyacinth
		Nearing the weak | hyacinth
		Consuming the strong | hyacinth
		Feeding the restless | hyacinth
		Decrypting the marks on your teeth / Fear what you may find / Revel in that which you won't | hyacinth
		Kissed, killed, and reborn | tom
		I'm going to apologize three times / once for your feelings, once for myself, and once for the creature in the kitchen | tom
		It's time to do the things they'd never imagine you doing | tom
		Don't get too far from the beast | hyacinth
		Eyes wide / Grin wider | hyacinth
		Your body image is ᶠ ˡ ᵘ ᶜ ᵗ ᵘ ᵃ ᵗ ⁱ ⁿ ᵍ  ʳᵃᵖⁱᵈˡʸ / It has a third eye | hyacinth
		Sleeping in the inbetween | hyacinth
		Hear yourself breathe  / Now stop / You decide | hyacinth
		Life goes on, perturbed but otherwise unchanged | tom
		It hurts better than it ever did before | hyacinth
		Your soul is not clean enough to be sold | tom
		Not a scratch, but a ʷᵒᵘⁿᵈ | hyacinth
		You don't fear being eaten alive... do you? | tom
		Kill the head, again and again | tom
		Your heartrate is climbing | hyacinth
		We've killed it and yet it moves / Again and again, striving to be better and failing as / I am drenched in the blood of what is lost and what I have yet to discover. / The beasts grin and I am befallen with gratitude / I skewer the beast. / For a time left long ago, when the blood did not drench me / And the ˢᵐᶦˡᵉˢ were not as wide as they have become. / The spear I carry is not mine to hold but my pilgrimage has gifted it to me. / I skewer the beast. / It groans and I grasp my hairless head / My age is irrelevant to this plight / For they see my sign and nothing changes / I am unrecognizable, indistinct, unsharpened / I skewer the beast. / And it dies, but it doesn't really die, or does it? Does anything? / It fades, I am blurred, my vision, my form, my thoughts / And god above and below is blind / Running from a fate with insufficient shoes / I trip in the misty, rusty haze / I lay and look into the not-sky / I skewer my internal organs / The weak are sheltered by my sacrifice and will be overcome at…  …my suffering to be ended and theirs begun. / But my spiked existence progresses through chaos, / And the sun grows ever longer / I know not to fear and yet I must, must cleanse the souls of the bloody and bruised, / Splintered and sought / &Beaten and befallen& / You watch me, you observe me, you with your pen and your smile / The hymn they sing continues; with / Knives for fingers and fingers for knives / Growing, out of rhythm out of time, as / Parts of my mind waver, as the space is being filled, growing, growth, grown / Defying the state of this world is for the clean / And yet my tainted form remains unchanged through this pause, this inescapable ruse / I try and leave / You do not / Real life is for those unlike me / And I trudge to the next beast / Mind, body, and bone / No place to call home / Not even my form, my thoughts, forlorn / And #Rebirth# / Ifcarnic ideals &seize& your domain / They stood, solid, stoic, faceless / Hollowed by the realization of what was, is, and always is / Superficial and glimmering / The sand is still caught between your eyelids, under your fingers, in the threads of your soul, timeless, bindless, ever-present constant of this ᶜʳᵘⁿᶜʰᶦⁿᵍ ᵖᵒʳᵗʳᵃʸᵃˡ / Such a blatant lie and we believe it / They smile and see, simply to be / And as the peeling skin of the world is pulled back / The smiles widen as they see / Truly see / And it is done / The sand falls from the bodies / And you rise and they rise and she rises / But it happens all over again / This is not rebirth, this is the pause over and again and the rich moon rises | tom
	`),
	// short-mid length, universe, moon, machine
	new Scroll("Lunar Parchment", `
		Fairnight, anybutton (affectionate) | tom
		Do not consider the monotonality of the fungus | tom
		Late onset IQ deficiency | shannon
		The vacuum followed me as I ran | hyacinth
		The average height is recursive | tom
		The moon is not our enemy (probably, it hasn't responded yet) | tom  
		Refumigate your house on the full moon | tom
		You don't know what the wizard does | hyacinth
		It's not worth it to try and figure out how the wizard does | hyacinth
		Live 'til you shouldn't | tom
		Be careful 'til you can't | hyacinth
		Clarity 'til it's over | tom
		Splitten rope giveth the trope | tom
		Thy sun is not identical | tom
		Help! It's asleep! | hyacinth
		Love in an instant | tom
		You can't hear the parchment, though it wails so | hyacinth
		Courting in an amber room | tom
		&this room looks kinda amber& ;) | hyacinth
		A cup is not a cup because all cups are stretchy bowls | shannon
		A new machine, to grind you to tiny pieces | tom
		Why can't I hear your name? | hyacinth
		Playing on a machine we mostly still have | hyacinth / tom
		Oats in the machine | tom
		Living organism in the machine | tom
		Your eyes are like the sky. Unpredictable and wet | shannon
		The clouds no longer care | tom
		Buy before you cry | shannon
		Something was off about this morning, for the air contained a small quantity of cyanide and a sprinkle of chives | shannon
		If a little knowledge is dangerous, libraries are #hell# | tom
		The night can be lighter than the day | anna
		Just because we can't do anything, doesn't mean we shouldn't | hyacinth
		I shouldn't feel safe here but I do | shannon
		The moon leaving / into the abyss | hyacinth
		Indivisible clarity in the dying universe | tom
		Grinding the midnight hours | tom
		Damn the moon is #big# tonight | tom
		Earole and Morles could be successors / The pregnancy times are &off the charts& however / We must wait | tom
		Safe, above and below | tom
		They are &whirring into action& | hyacinth
		Rings for your non-physical appendages | tom			
	`),
	// music, writing, art, creation
	new Scroll("Jeryity", `
		The music is ever-present. Embrace it or perish | tom
		We heard that it would end in a museum, but it hasn't yet | tom
		The pictograms are chipped at the edges | hyacinth
		Slanted hieroglyphs for you and yours | hyacinth
		Oh, glorious instrument, it rhymes! | hyacinth
		Music on the walls, indicating you should run | hyacinth
		You can't hear them; I can't hear them; who's ringing the bells? | hyacinth
		We don't know what's echoing / Nobody said anything to spur it to action | hyacinth
		Don't hear them, only listen | hyacinth
		You don't have to listen to that | tom
		Formatting for the apocalypse | hyacinth
		Authors, like dogs, can only hear your tone of voice | hyacinth
		Fuzzy clay can be found just under the igneous layer | hyacinth
		The tune is sad, melancholy, &meaningless& | tom / hyacinth
		Change the title accordingly | hyacinth
		Parenthetically, it was all resolved | molly
		Pat the wood of the instrument, let it rest | hyacinth
		Foolishly, I took the eggs | tom
		Monotonal phosphorous can only be obtained by the unimaginative | tom
		The insidious prince only exists in your mind's paintbrush | tom
		Now fitting into your own jurisdiction / Become your own vice? | tom
		I plan to make your imagination &way& more exciting | tom
		There is a slim chance you will hit thirty or more | tom
		The attic oozes jello while the band plays on | molly
		I wonder if pianos can feel the constant agony of their keys being abused. / The music that plays is just their screams | shannon
		Tune the audience | hyacinth
		Don't use &direct& quotes | hyacinth
		Shielding children from literacy | tom
		Designing for the evil overlords | hyacinth
		Don't be afraid of your creation (it might not hurt you) | hyacinth
		The creation has a mind* | tom
		Your dreams will say that too if you aren't careful | tom
		Rapidly approaching author | tom
		Fourth person - at your door right now | tom
		Lime-green covers of "solid" books | hyacinth
		It's obstreperous how innovative you are in this &specific& moment | hyacinth
		It makes tangy text | hyacinth / molly
		Walk the path of revision carefully and tread not so far as the forest of loss | tom
		Strangers are truer than fiction | molly
		So many more words than you ever expected / The madness seeps in as you read | hyacinth
		I'm headed to my Thinkin' Cube | rowan
		Paradoxical is just &standard& weird | hyacinth
		Surprisingly, the two connected works have several parallels | hyacinth
		Frustratingly mild snaps (&arpeggiated&) | hyacinth
		50,000 lines and the only thing different is my first and last name! | tom
		You've received a "letter" | tom
		The Music is always True | ryan
		Goddamn you #love# that music | tom
		They're biting the cellos | hyacinth
		...nd he played on as it happened | tom
		It's perfect for my movies | tom
		Frightening words with everyday definitions | tom
		Frightening definitions of everyday words | hyacinth
		Motifs of your free time | hyacinth
		They read a simple poem | hyacinth
		Tooth maracas | hyacinth
		I'm just haunting these people, in a literary sense | lucca
		That almost deserves music notes! | hyacinth
		Drawing the curtains in pen | hyacinth
		Of meteor and glass / The storms which quickly pass / The humming of the running road, beating swift and fast / / The strumming of my weary soul / Crossing on the lonely fold / Wind and rain and storm / / The fading of my weary self / Sunk and sought and stole / Chasing to a better place; foolishly, I mourn / / Hence my drawn-out shadow grew / Amber, gold, and pale / Pushing on through plateau sands / Land which has since failed / / Sometimes I wonder past the time / A boat without a sail / Sometimes the meaning slips away and / I am lost in the mail | tom
	`),
	// confusion, random, less philosophic
	new Scroll("Hyubert", `
		The cupboards contain boundless hope (bounded of course by the cupboards) | hyacinth
		The grass is greener on the side closer to the chemical plant. Neon even | hyacinth
		We like the taste of mystery | hyacinth
		10-12 times a month, they hunt | hyacinth
		I see... you've seen. You've seen what it feels like to be an asshole | AI
		We are there yet. What now? | hyacinth
		Psst. You're missing a color | tom
		Splitshop in the middle of the state | tom
		Left right in the middle | tom
		Scribbling is an unproductive mechanism, built on obscure and unjustified beliefs, / however its uses will soon become apparent | tom
		Alight from your fingers | tom
		The items used to control the radiation are frequently quite greasy | hyacinth
		Highly athletic in the waiting room of life | hyacinth
		The Big Mind Reset of the New Year | tom
		The garbage speaks, before and after | ryan
		Prepare to be blown away by my demands to have neon magenta triangles scattered across all the pages | hyacinth
		Lived you have not, until enveloped in the gourds you have become | wesley
		The sheer mindfuck of a group of children in a circle throwing rocks | tom
		Skulls are thicker so you can't hear 'em unless you get real close | tom
		An onion is very much like the earth, in the sense that it has many layers and can't do calculus | hyacinth
		The air feels thicker than the ground | tom
		A dark spot where the sun was shall fall into the dark | tom
		Don't do drugs, become absorbed in unreality instead | tom
		The difference is that a spoonful of sugar is not much | tom
		Come down to Saint France Auto Bay Company Church down on the hill for free  r e p a i r s | tom
		Blue indicates you should #stay#! stay! &stay&! | hyacinth
		Crumbling sidewalks typically are a facade | tom
		Earthly storefronts are frequently in the business of disguise | hyacinth
		Flicks hair before turning awake | tom
		Shirtless in a removable vehicle | tom
		Laundry is a team effort when &they& arrive | hyacinth
		My neck is going to be excessively flexible for the rest of today | hyacinth
		Make sure to brush your head, you might get cavities | rowan
		Forgot to plug in my elbow last night and now my brain's at 6% | molly
		You vacuumed the lawn thrice daily and yet still, somehow, grubs | molly
		Smote by cornichons. Again. | molly
		Share air with the others through subterranean methods | molly
		Single player checkers | tom
		Team based chess | tom
		Party sized solitaire | tom
		It's easier to keep the peace if your ambitions are small | molly
		Carbonation is simply the souls of aphids, captured and canned | molly
		If we have a little alphabet at our disposal, we can do a little buff and polish | molly
		Just an unacceptable amount of compost | hyacinth
		Consumed by gumption | molly
		Here they are / Stay / stay / &stay& | hyacinth
		Gender-neutral fellow | tom
		What are you waving | tom
		Ten things #only you# can do with expired soap | tom
		I'm here, I'm queer, and I'm indented in the middle | hyacinth
		Safety goggles are required to handle the creature | tom
		Do you need some rainbows as backups for today? | molly
		A penumbra of chit-chat hovered above his head | molly		
	`),
	// people, foolish things
	new Scroll("Fools", `
		He was like a discarded story: hiding in recycling bins and full of terrible ideas | hyacinth
		A delirium gives justification for its abrupt greeting | tom
		Mackenzie: good gods, good humans, good stories, good people, good music | AI
		And Mackenzie said the terms aren't negotiable, but we'd continue regardless | tom
		Mackenzie: last time, last runner, last life | tom
		Special characters, special people | hyacinth
		Grim, the peddler, amongst the Lorician | tom
		Cephalopods are particularly bad spies | hyacinth
		For those who can empty their souls: | molly
		I open my mouth and the continent surges through my esophagus | hyacinth
		Purchasing continents on the dark web | hyacinth
		Scoring for &the& enemy | hyacinth
		Purple caps on empty heads | hyacinth
		So you admit he has fingers but no hands? | hyacinth
		The length of the nasal cavity can be unexpected, and not for the faint of heart | hyacinth
		We don't know because we crossed it substantially | hyacinth
		Only worry about what &won't& happen | hyacinth
		We'll have a splendid time. It'll be absolutely wonderful there. You won't have to worry about a singular thing | tom
		The rampant carnage caresses you into a lengthy slumber | tom
		Canniness in this trying time | tom
		Dying of thirst is a substantial possibility on the way from legality to morality | hyacinth
		Clicking noises aren't &necessarily& a bad sign | tom
		Why are you alright? | tom
		Overdramatic, but in perfect time | tom
		Sufficiency, sweetheart | tom
		Tied up in holiday ribbons! | tom
		Many simply voted for a candidate they detest because they feared the other guy | tom 
		Discernibly indistinguishable | tom
		I bet I haven't the slightest clue | hyacinth
		Falling right on their time | tom
		"If you feel lost, remember everyone else is too, in their own way..." / "I'm asking for directions you idiot!" | hyacinth
		You dare to be bored in this house!? | hyacinth
		A rotating house for &ease of mind& | tom
		"&We& are all the best music," he said from his throne of lies | declan
		When there is silence, there is a lack of conversation | sofia (t)
		I love myself / A good fjord | declan
		You have a more objective opinion of the shadows | tom
		Remove power from your device (without using it) | hyacinth
		An academy of illustrious nincompoops | molly
		He has the genius not to say the extraordinary but to say the ordinary | anna
		You are the pilots eyes | shannon
		...Assuming your oyster is a bunch of annoying debugging | camden
		He literally just killed his glasses | forrest
		Now &that's& how the job is done | tom
		I know acceptance when I see it | tom
		I know resignation when I see it | tom
		I know reflective, despite not having seen it | tom
		The miser and his mise | tom
		Live a life where, someday, saying "remember the bucket of bees incident?" will bring stern and nervous looks to everyone's faces | hyacinth
		What do you want me to say? "What are we aware of"? | wes
		Encrypting your soul | tom
		There many things young children will wonder in their lifetimes, such as: "How long will the flame persist?" | tom
		The turrets are just a precaution | hyacinth
		Taken* photographs of the mathematically proven "unreal" | tom
		The stranger is drawing everything you've seen | tom
		Always doubt the skeptics | alan
		Those who try and stop you have never seen the power of bees | declan
		We take nothing as a yes / We take everything as a no | hyacinth
		Wants vs. needs guys! Skin is &completely& optional | hyacinth
		They can ask &themselves& to do things | wes
		I haven't mentioned it | tom
	`),
	// shapes, geometry, form
	new Scroll("Meilothon", `
		Non-Euclidean geometry uses the romantic solids | hyacinth
		Folding, folding, folding. When will it's form repeat? | hyacinth
		Perfect squares are impossible in this realm / We believe it is due to the makeup of matter | tom
		Biting the Gordian knot | tom
		Knotted up words | tom
		Half-hearted black holes | tom
		Unspinning particles / Unvibrating knots | tom
		You look very trapezoidal from this angle | hyacinth
		...and the vessel was constructed to be longer than it was wide / the height would be changeable if needed | tom
		The builders, although small, are always with you | tom
		This object contains several surfaces, most of which have vernacular potential! | hyacinth
		Distance is a persistent construct | tom
		You are too big to live on a tiny island in any shape or form | tom
		Spaces between your fingers and noses | hyacinth
		Heavy objects going for an excursion | hyacinth
		Why do pencils &have& six sides? | wes
		All I'm saying is that makes overlap super complicated | hyacinth
		Zooming by at possible speeds | tom
		You are scared of the space inside | hyacinth
		The icosahedrons are &languishing& | tom
		The icosahedrons are #crestfallen# | tom
		Bottles #filled# with none of the states of matter | tom
		Butter prism in a glass | hyacinth
		Elliptical is as elliptical does | molly
		Division into various sanctions | tom
		Volumetric, Voluimperial | hyacinth
		Truly reprehensible geometry | hyacinth
		New quarks! | tom
		Phase diagrams are purely situational. &pours you a cup of steaming liquid oxygen& | tom
		Unbounded force from a swinging plumb bob | tom
		Three dimensions mapped into your mind | tom
		Make orbs round again | wesley
		Immensity is an unknown construct | tom
		Strong gravity, weak gravity, and visible gravity | tom
		Circles dream of being edgy, but alas | molly
		Thinking outside the box and inside the sphere | hyacinth
		Merely a yard from your home | hyacinth
		Once upon a space | tom
		The heavy vibration is indeed necessary | tom
		You'll know when you're not contiguous | molly
		Estranged coordinate points in space | tom
		Geometry for the undimensioned folk | tom
		Gods in a circle, man in a sphere | tom
		Especially gradiented spoon | tom
		Knotting of the intestines | hyacinth
		Periodic visits to the infinite will leave you gasping for purpose | hyacinth
		Borders of my mind | tom
		Origami-shaped mind | tom
		Attacked from an obtuse angle | tom
		Our beings... a perfect circle | tom
		Speed limits are for the third dimension | ryan
		Deep, bitter, and hateful three-dimensional forms | tom
		Cardioid shaped skull | tom
		The box has six sides people can see | anna
		Spherical life on a spherical world | tom
		Kaleidoscope, oh sweet swirling geometric mandala, stand still | anna
		Or... and hear me out... a triangle | tom
		                                  Why?/                          When the sun/         sinks below the horizon, and/ • all we have known fades to oblivion, •/Why? why does the future always  Why?/As they      beckon us towards     Why do/rise and begin    Demise    we think that/their celebration,  •  our consciousness/why do they think   will be consecutive/they are no longer   or infinite? It never/with us? Spirits all   ends, but it does /         think they are   pause from time/             one with the  to time, of/                            Dead  course/                                       • | hyacinth
	`),
	// government, electronics (ock - la - swah)
	new Scroll("Oklacois", `
		Don't fear the establishment* | hyacinth
		Just a switch on a circuit board | tom
		Computers aren't electronic, but will become electronic once you know what you're looking for | tom
		She turns wiring to meal for the unconstitutionalists | hyacinth / tom
		&holds up olive& Electrically sufficient | hyacinth
		Evil SUV electric car | forrest
		Ghosts are kept apart from civilians in federal cemeteries | tom
		The blackberry bushes have come to an unanimous consensus | tom
		Two small, particular, oddly specific tasks | molly
		Radical centrism is a controversial stance | hyacinth
		The office of establishment is heavy with betrayal | hyacinth
		Needlepoint \\& Needleclick | hyacinth
		The new reign is disappointed in its citizens | tom
		Applications violating the basic barriers of technology / Worms floating in the air | hyacinth
		Electric shocks make the air stick to your skin | hyacinth
		From the floor on up | hyacinth
		Edible technology is the ⁿᵉˣᵗ ˢᵗᵉᵖ | tom
		Cube-shaped flags | tom
		C.l.a.r.I.t.'.Y | tom
		Mandated cog turning initiative | tom
		The administration wants a population decrease | tom
		"A mallet for peace and a mallet for subduing the spectators" | tom
		The cameras are decoys. It is the walls that view you | tom
		Electrically bitter | hyacinth
		Cartridge based desire | tom
		Certified pipe-forgetter | tom
		SWIM AREA: there is no SWIM allowed in the ˢʷᶦᵐ area. P-p-pleeeease coalesce ᵉˡˢᵉʷʰᵉʳᵉ | tom
		And I spoke unanimously | hyacinth
		Caps-locking your life and times | tom
		Cannibalistic machines causing slight networking issues | tom
		You've been put on Silence! | tom
		An active effort to be addressed | hyacinth
		An officer and a half | tom
		Selling the ocean just to pass a new motion | tom
		The taxis are &sliding smoothly& / They'll be here soon | hyacinth
		Truly exonerated on a shockingly rainy day | hyacinth
		We're adding to the document | hyacinth
		Liaising with the incandescence | molly
		I know their actions, not themselves | tom
		Blame nobody, expect nothing, and serve the motherf*****s / Lord knows they need it | lewis
	`),
	// definitions
	new Scroll("Dictatics", `
		Anagrams (\\\\&ˈanəˌgrams& \\\\): In order to get a deeper understanding of mathematics and to grasp the world of philosophy, here is a list of most important art | AI
		Moderation (\\\\&ˌmädəˈrāSH(ə)n& \\\\): An effective anti-productivity mechanism | hyacinth
		Netches (\\\\&nɛtʃz& \\\\): A shallow corner, a human can only descend about six in a lifetime but others can do much more | tom
		Aplosery (\\\\&æploʊsəri& \\\\): Knowledge gained through metaphysical or spiritual extrasensory input | tom
		Aplosiatic (\\\\&æploʊsiætɪk& \\\\): One who is detached from reality | One who gains experience\\/input from extrasensory sources | tom
		Lelipatheim (\\\\&lɛˈləˌpæθiɛm& \\\\): The state of experiencing a large number of conflicting emotions at the same moment, typically in some balance | tom
		Halymist (\\\\&hæləmɪst& \\\\): One who sees reality as drastically worse than it is, but is optimistic about it | tom
		Kiplim (\\\\&ˈkɪpˌlɪm& \\\\): An easily snapping rope | tom
		Ribbery (\\\\&rib(ə)rē& \\\\): An addition of bones | A facility for the harvesting of bones | tom
		Orthomine (\\\\&ˈorθoʊmaɪn& \\\\): Any one of the narrow, vertical, pre-Illuminating tunnels within the Pillars | tom
		Nau (\\\\&naʊ& \\\\): A medium sized, freshwater fish. Lives in alpine climates, such as the Apex | tom
		Cenosidian (\\\\&ˈsiˌnoʊsədiɛn& \\\\): One who cannot remember the past | One who lives within the Respite | tom
		Nepymil (\\\\&nəpɪmɪl& \\\\): The "soil" found in the Spite Range | tom
		Nipore (\\\\&nəˈporeɪ& \\\\): To be intentionally late | tom
		Aplurion (\\\\&ˈæpləriɒn& \\\\): An impossibly large watermass | tom
		Orvis (\\\\&ˈorˌvɪs& \\\\): A plant varying in size with a thick-spined, spindly root structure and an orange-colored, thick, sticky trunk called 'the lily' that grows naturally within the Spite Range | AI
		Itzkahova (\\\\&ɪtzkəhoʊvə& \\\\): A deep, biodiverse crevasse | tom
		Counseling (\\\\&ˈkouns(ə)liNG& \\\\): Stop being sad in this hell of an experience | tom
		Retrulatery (\\\\&rɛtrulɔtəri& \\\\): Decor, typically ceremonial or ritualistic | tom
		Sum (\\\\&səm& \\\\) [math]: To #sum#marize data | hyacinth
		Oydiu (\\\\&ɔɪdu& \\\\): Regretting enjoyable actions as you do them, all while continuing | hyacinth
		Compass (\\\\&ˈkəmpəs& \\\\): An effective tool for idiots | tom
		Compass (\\\\&ˈkəmpəs& \\\\): An ineffective tool for architects | hyacinth
		Rachet Tool (\\\\&ˈrætʃ ɪt ˈtül& \\\\): A moderate tool for the intellectually inclined | tom
		Mevene (\\\\&mɛ̃ˌvin& \\\\): Slow, unnoticed, sneaky | tom
		Opaquify (\\\\&oʊˈpɑkɪfaɪ& \\\\): To make more convoluted and obscure | hyacinth
		Yogurt (\\\\&ˈjoʊgərt& \\\\): The ultimate chicken or egg | molly
		Piffcor (\\\\&pɪfˌkor& \\\\): The smell of wet charcoal\\/ash | The smell of an old fire | tom
		Inspiration Rod (\\\\&ˌinspəˈrāSHən räd& \\\\): A long cylinder made of steel used to increase the chance of inspiration striking at a specific location | hyacinth
		The lil' guy (\\\\&T͟Hə lɪl ɡī& \\\\): The specific and abstract of the Hund | hyacinth
	`),
	// zoest
	new Scroll("Umlauts", `
		Window pains: baguettes made of glass | hyacinth / zoë
		The given is in the pudding | zoë
		Throw back your head and scream | zoë
		Just that little existential something in my day | zoë
		The lil' guy's feeling snuggly | zoë
		Two points determine a lime | zoë
		Not alive, but awake | zoë
		On a sinking ship, given the choice between a first-class life and a &sweet& boat, you chose the former | zoë
		I'm braiding my bones | zoë
		Ah yes! Your two genres! Psychology and evaporated milk | zoë
		Do you want me to &rescind& my offer | zoë
		I got condensed | zoë
		Why don't &you& know what your lungs taste like? (accusatory) | zoë
		Hold out your soul, close your tongue, and get a big surprise | zoë
		I think I'm funny / It seems I'm very alone in that thought | zoë
		I will be the rice I want to see in the world | zoë
		I get my hair done at the blacksmith's | zoë
		Black market orthodontia | zoë
		We've been hired to party and we don't care | zoë
		What about ice hazards | zoë
		That was now and this is then | zoë
		Crash bang moo! The cows have dispersed | zoë
		Too many cooks spoil the soup / You only need one for proper flavoring | zoë
		My get up and go got up and sat back down | zoë
		I'm only a genius when I need to prove I'm not | zoë
	`)
];

// compute weights
const allProverbs = scrolls
	.flatMap(scroll => scroll.proverbs)
	.filter(scroll => scroll.authors.length > 1 || scroll.authors[0] !== "unknown");

const allScrolls = scrolls
	.map(scroll => scroll.title);

const totalProverbs = scrolls
	.map(scroll => scroll.size)
	.reduce((a, b) => a + b, 0);
for (let i = 0; i < scrolls.length; i++)
	scrolls[i].computeWeight(totalProverbs);

const allProverbWords = allProverbs
	.map(proverb => proverb.text
		.split(/\b/g)
		.filter(piece => piece.match(/\w/g))
	);
const allWords = allProverbWords.flat();
const allWordLengths = allWords.map(word => word.length);
const allProverbWordLengths = allProverbWords.map(words => words.length);
const allProverbLetters = allProverbWords
	.map(words => words
		.flatMap(word => word
			.toLowerCase()
			.split("")
		)
	);
const allLetters = allProverbLetters.flat();
const allAuthors = [...new Set(allProverbs.flatMap(proverb => proverb.authors))];

function authorsOf(fragment) {
	const contains = allProverbs.filter(proverb => proverb.text.toLowerCase().indexOf(fragment.toLowerCase()) > -1);
	if (contains.length === 1) return contains[0].authors;
	const matches = allProverbs.find(proverb => proverb.text === fragment);
	return matches ? matches.authors : null;
}

function amountAuthoredBy(author) {
	return allProverbs.filter(proverb => proverb.authors.includes(author)).length;
}

function percentAuthoredBy(author) {
	return amountAuthoredBy(author) / totalProverbs * 100;
}

function percentToProverbs(author, percent) {
	const amount = amountAuthoredBy(author);
	percent /= 100;
	const currentPercent = amount / totalProverbs
	const finalPercent = percent + currentPercent;
	return (amount / finalPercent - totalProverbs) / (1 - 1 / finalPercent);
}

function proverbsToPercent(author, proverbs) {
	const amount = amountAuthoredBy(author);
	const finalProverbs = amount + proverbs;
	const finalTotal = totalProverbs + proverbs;
	const percent = finalProverbs / finalTotal - amount / totalProverbs;
	return percent * 100;
}

function proverbsBy(author) {
	return allProverbs
		.filter(proverb => proverb.authors.includes(author))
		.map(proverb => proverb.text);
}

function howMuchToWorry() {
	return 82173.12739 * Math.exp(scrolls.find(scroll => scroll.title === "Freud the Spinner").length / totalProverbs);
}

let duplicates;
{ // find duplicates
	const proverbs = scrolls
		.flatMap(scroll => scroll.proverbs)
		.flatMap(proverb => proverb.text);
	const counts = {};
	for (const proverb of proverbs)
		counts[proverb] = (counts[proverb] ?? 0) + 1;
	duplicates = Object.entries(counts)
		.filter(entry => entry[1] > 1)
		.map(entry => entry[0]);
};