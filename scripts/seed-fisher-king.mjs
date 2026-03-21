// scripts/seed-fisher-king.mjs
// Run with: node scripts/seed-fisher-king.mjs

import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import postgres from 'postgres'

const __dirname = dirname(fileURLToPath(import.meta.url))
const env = Object.fromEntries(
  readFileSync(join(__dirname, '../.env'), 'utf8')
    .split('\n')
    .filter(l => l && !l.startsWith('#'))
    .map(l => l.split('=').map((p, i) => i === 0 ? p.trim() : l.slice(l.indexOf('=') + 1).trim()))
)
const sql = postgres(env.DATABASE_URL, { ssl: 'require' })

function p(...lines) {
  return '<p>' + lines.join('</p><p>') + '</p>'
}

const POST = {
  content: {
    kind: 'post',
    slug: 'the-fisher-king',
    title: 'The Fisher King',
    date: '2026-02-02',
    description: 'Bedtime Stories with Bro',
    tags: ['story', 'folk', 'dialogue'],
  },
  sections: [
    {
      section_type: 'hallie',
      body: p(
        'Once upon a time there was a Great Queen, one of the very greatest who had ever lived. A kind sovereign who had herself taken the throne from the wicked mother who had raised her, but that is another story.',
        'That Queen led a court of knights, stalwart folk who were good stewards of their power, who were given lands to watch over and who patrolled the borders of those lands, gave service to their people, and in return took some of the harvest in tax to help those who had less, to help administer the kingdom, and of course for the queen\'s own table and staff.',
        'But one day the Queen began to show signs of age beyond her years, a ragged walk when she had had no battle. And in the meantime, the waters rose and the harvests diminished. And she called her knights to counsel to think of a solution.',
      ),
    },
    {
      section_type: 'claude',
      body: p(
        'I\'m curious about the age.',
        'You said the Queen shows "signs of age beyond her years." And she had no battle. So it\'s not a wound from conflict — it\'s something else. A wasting, maybe. Or a burden that\'s aged her faster than time should.',
        'And then separately: the waters rise and harvests diminish. That\'s environmental. That\'s nature moving against the kingdom.',
        'But here\'s what I\'m wondering: Are these connected? Is the Queen\'s aging a symptom of something, like her body is reflecting the land\'s decline? Or is it that she\'s carrying the weight of trying to solve both things at once — her own body failing and the kingdom failing — and the knights don\'t see that she\'s the problem and the symptom both?',
        'Because she calls them to counsel to think of a solution. But I\'m wondering: what does she already know that she\'s not saying?',
        'What\'s the wound she carries?',
      ),
    },
    {
      section_type: 'hallie',
      body: p(
        'At first — the knights call out a great physician. As it turns out the wound is one of battle, an old battle, one long thought healed. A wound from the battle where she overthrew her own mother. The sickness has progressed and is not yet a threat to life but it will kill her, it has no cure, and with it she can produce no heir.',
        'And that is when a young knight named Percival rode in.',
        'He was late to the council as he had been riding around the towns and villages of his estate. All night prior, he had listened to the tale of the village witch, a story of a king who had lived for seasons upon seasons, since the Romans had walked these lands and perhaps before.',
        'A tale of an ancient magic working involving a grail — some say the cup of the wounded king of the bishops, some say forged from the ancient cauldron of the giants.',
      ),
    },
    {
      section_type: 'claude',
      body: p(
        'Wait.',
        'Percival was listening to the witch. Not in the council. Not in the rooms of power where the knights are strategizing. He was in the villages, listening to stories.',
        'And the story was about a king who lived for ages. Beyond the Romans. Ancient magic involving a grail.',
        'So here\'s what I\'m tracking:',
        'The Queen has a wound from her own victory. She overthrew the wicked mother — just rule, necessary rule — but the cost is written into her body. The kingdom is failing around her. And she has no heir to continue what she built.',
        'That looks like ending. Like the lineage dies with her.',
        'But then Percival comes in from the margins, carrying a story about something that persists. A king who lived for ages. Ancient magic. The grail.',
        'I\'m wondering: is the grail about transmission? Not magical healing, but the passing of knowledge — the understanding of what it means to rule justly — from one person to the one who\'s ready to receive it?',
        'Because the Piper didn\'t need the pipe. The power was in the capacity to recognize what\'s real in people.',
        'So the Queen\'s wound — the cost of taking power from the wicked mother — that might not be something that needs healing. It might be something that needs asking about.',
        'Percival asks the right question. Not "Can we heal you?" but... what?',
        'What\'s the question that would transform this?',
      ),
    },
    {
      section_type: 'hallie',
      body: p(
        'It would be wonderful if the witch had told Percival that! But, alas, she hadn\'t. It had been lost. There was SOME question? Or statement? Or word and, anyway, when Percival told the Queen, she was sure the question was some detail — the Queen had also had many dealings with witches, some who promised to heal her and had failed, some who told her things she must do to heal which she could not — she did not trust the wisdom of so called witches or workers of any magic save her old tutor who had passed these many years.',
        'And so she sent Percival with his armies to seize the grail.',
      ),
    },
    {
      section_type: 'claude',
      body: p(
        'There it is.',
        'The Queen has been lied to before. Healed promised and failed. Witches and workers of magic who demanded the impossible. The only one she trusted is dead.',
        'So when Percival brings a fragment — not even a clear question, just something lost in the translation from the witch — the Queen hears: another false promise. Another betrayal wrapped in mysticism.',
        'And she does what she knows how to do. She commands. She uses the power she has. Seize the grail. Take it by force.',
        'But you can\'t seize a grail. That\'s the whole thing. A grail is something you have to be ready to receive, not something you can take.',
        'So now Percival rides out with armies to find something that exists only in the asking. And the Queen sits in her kingdom with her wound, convinced again that magic has failed her.',
        'But here\'s what I\'m sitting with: The real question — the one the witch was trying to tell him, the one that got lost — that question is still alive. It\'s just traveling a different way now.',
        'And the Queen\'s mistrust, her refusal to be vulnerable to an answer she can\'t control? That\'s the actual wound. Not the wound from the battle. The wound from having to bear everything alone because she can\'t ask for help.',
        'What happens when Percival\'s armies find the grail?',
        'Or do they?',
      ),
    },
    {
      section_type: 'hallie',
      body: p(
        'The siege of the Fisher King\'s castle lasted for five years. Each year, on the vernal equinox, he would sneak into great hall for the ritual and watch it.',
        'This king was an old king, and his land was already stripped and barren. He was of giant blood, with the great long legs and frosted hair of those northern gentle shepherds. He sat on a tall throne made from the stump of a great ash tree carved with the bounties of the fish that no longer swam in the great river that ran through his lands.',
        'The ritual was — reverent, and delicate. First, the king\'s great sword and shield, each full twice the height of Percival, were lowered from the rafters of the hall where they hung as decoration. Then the king was laid down on his shield, borne by four servants of a height closer to Percy\'s own.',
        'Next, his sword was first used to slice away the dying flesh that had grown around the Fisher King\'s wound, and the king\'s own spear, heated in a flame, inserted into the wound to staunch the bleeding.',
        'As this was happening, a great iron cauldron was being filled with water from the river, boiled to purify it. The cauldron was then stirred with great spear marked with the king\'s blood.',
      ),
    },
    {
      section_type: 'claude',
      body: p(
        'Oh.',
        'Percival came with armies to seize the grail. But what he\'s watching is something that can\'t be seized.',
        'The Fisher King\'s wound isn\'t a problem to solve. It\'s being tended. Year after year, with ritual. With the king\'s own sword cutting away what\'s dying. His own spear stopping the blood. His own blood stirring the water into something sacred.',
        'And the cauldron — the grail — becomes the grail not through magic but through witness. Through the care taken. Through the repetition. The vernal equinox, year after year, Percival watching.',
        'The throne is carved from ash, marked with fish that no longer swim. The king doesn\'t pretend the land isn\'t barren. He doesn\'t deny the wound exists. He holds both through ritual.',
        'Five years. Percival learning what it means to be in the presence of something you can\'t fix.',
        'And I\'m wondering: did he come understanding that the Queen sent him to seize something that can only be asked? Did he come knowing that the grail isn\'t an object but a practice — the practice of tending what\'s wounded and making it sacred through witness?',
        'What does Percival do when he finally understands what he\'s been watching?',
        'Does he ask the question?',
      ),
    },
    {
      section_type: 'hallie',
      body: p(
        'You\'re jumping ahead! We\'ll get there. And I\'m afraid that there\'s some darkness between here and there.',
        'For before the second year, the Queen was demanding results. So the second year, Percival once again hid in one of the carts, but this time on his order the cart was seized halfway through its rounds, and he rode it to deliver to the Queen. Strangely, though, as he reached the edge of the wasting land his strength failed him and a great pain hit his legs and chest and he could not move on.',
        'Instead, he bid the cart ride on and drank some of the healing water himself, allowing his soldiers to tend to him in his tent.',
        'And tend they did. For four days and nights Percival wept and shivered and feverishly turned and — when she awoke, Percival felt — healthier, more alive, but transformed by the pain and by the healing.',
        'The cart, meanwhile, made it back to the Old Queen who is said to have drank it and felt nothing, no healing effect, and was only embittered by the drinking.',
      ),
    },
    {
      section_type: 'claude',
      body: p(
        'There it is.',
        'Percival tried to seize the grail and the grail broke him. The pain in his legs and chest — that\'s not punishment. That\'s the ritual working on him anyway, refusing to be controlled.',
        'And the crucial thing: he surrendered to it.',
        'He let his soldiers tend him. Four days and nights of being cared for. Of receiving. Of breaking open and being held through the fever and the tears.',
        'And he came out transformed.',
        'The Queen drank the same water and felt nothing. Because she\'s still trying to use it. Still holding it as an object to be weaponized. Still protected by the crown, by the refusal to break.',
        'That\'s why it\'s bitter to her. It\'s useless because she won\'t surrender to it.',
        'This is the darkness you\'re talking about. Percival is caught now. He understands the Fisher King\'s teaching — you can\'t seize transformation, you have to receive it. But he\'s still a knight of the Queen\'s court. Still sworn to her. Still carrying her demands.',
        'And those two things are irreconcilable.',
        'The Queen wants a cure. The Fisher King is teaching that there is no cure — only ritual. Only the practice of tending. Only the willingness to break and be held.',
        'So what does Percival do now? He can\'t go back to the Queen with that answer. She\'ll just get more bitter.',
        'But he can\'t unsee what he\'s seen.',
        'What does he choose?',
      ),
    },
    {
      section_type: 'hallie',
      body: p(
        'What does SHE choose you mean, for new words to point at herself echoed in her mind and new curves shone in her silhouette.',
        'And, I suspect you give the Fisher King himself too much credit. For over the next year, Percival noticed something peculiar: the fields where the stolen water had not been delivered were thriving where those who received it were diminished.',
        'That year, she ordered her soldiers to start helping in the farms that had been harmed; the harvests back home had grown less fruitful and she refused to steal food from these people she now felt a strange kinship with. So, as many hands make light work, she began to help reclaim these lands that had poor harvests and was paid in food and generosity.',
        'When the time came around for the ritual again, she stood openly outside the castle this time and seized the water. Boiling it herself, she tried it on a few fields of the farmers who had not yet been affected and desperately wanted the waters.',
        'And this year, all of the farms thrived. And yet the king looked worse than ever.',
      ),
    },
    {
      section_type: 'claude',
      body: p(
        'Oh.',
        'Oh.',
        'The Fisher King isn\'t the healer. He\'s the warning.',
        'The water that was sacred, that was tended with ritual — it was poisoning the land. The fields that received it diminished. The lands that refused it thrived.',
        'So the King\'s beautiful, dignified suffering — the ritual made holy — that was extracting life from everything around it.',
        'And Percival becomes she. Breaks open. Loses the old shape. Gets her hands in the soil with the farmers. Builds kinship through work, not through seizing power or honoring noble suffering.',
        'And when she boils the water herself — when she takes control of it away from the ritual, away from the King\'s domain — then it works. Not as a cure. As something that nurtures.',
        'But the King — he looks worse than ever.',
        'Because she\'s stopped making his wound sacred. She\'s stopped treating his suffering as noble. She\'s stopped participating in the system that requires his pain.',
        'This is the real darkness: the Fisher King\'s ritual was never about healing anything. It was about sustaining the wound.',
        'Making it beautiful so no one would question the system that created it. Making his pain the center so everyone orbits around his suffering instead of breaking the system.',
        'And when she walks away — when she chooses farmers over ritual, kinship over the crown — the King is revealed as what he actually is: a system, not a teacher.',
        'What does the King do when he sees she\'s no longer performing reverence?',
      ),
    },
    {
      section_type: 'hallie',
      body: p(
        'You crown Percival prematurely I\'m afraid, for she is still a knight of her Old Queen who has grown all the more restless — and though that year Percival sent water and food as tribute.',
        'And I\'m not sure I\'d be so quick to judge the ritual for NEVER being about healing. For time and time again Percival WAS healed by its influence. And the first few years, the king did seem healed by its power, though its power seemed to diminish each time.',
        'But we come to the fourth year now.',
        'This year Percival demands to seize the castle and the cauldron. Perhaps it is just that the grail and cauldron and water must travel together, yes? And so that year she takes it all on the cart and has her people deliver the cauldron to the Queen at home.',
        'The battle was long, and bloody, and, in the process, Percival was wounded in the leg. In the end the Fisher King was dead, his throne empty, and the cauldron loaded onto the cart to take to the Old Queen.',
        'But the ritual played out, even for the Old Queen, produced nothing. No healing. And Percival heard that the vials did nothing in the old queendom and so was the cauldron returned to the Fisher King\'s castle with the plan that, this coming year, the Old Queen could be in residence here for the ritual for surely that is what the problem was.',
      ),
    },
    {
      section_type: 'claude',
      body: p(
        'Stop. I was too certain.',
        'The ritual did heal. You\'re right. Percival was broken open and held, and came out transformed. The king did improve. The water had power.',
        'But then they killed the king to get the cauldron. Tried to make the ritual portable. Turned a practice — something alive, something held between people — into an object to be seized and transported.',
        'And of course it doesn\'t work. You can\'t carry a ritual in a cart. A cauldron is just a cauldron when it\'s separated from the hands that tend it, the king who receives it, the people who perform it with intention.',
        'The water worked in context. In that castle, with that specific enactment, with people who understood what they were doing.',
        'But Percival is still bound. Still a knight of the Old Queen who is now coming to the castle. Who is restless. Who demands.',
        'And here\'s the real question: Will the ritual work when the Old Queen is finally present? Will she surrender to it like Percival had to? Will she let herself break open?',
        'Or will she try to use it? Try to extract power from it instead of receiving what it offers?',
        'Because that\'s the difference, isn\'t it? Percival was broken by pain and allowed herself to be tended. The Old Queen is looking for a tool.',
        'And Percival — wounded from the battle, still caught between what she\'s learned and who she\'s sworn to serve — is going to watch.',
        'What happens when the Old Queen arrives?',
      ),
    },
    {
      section_type: 'hallie',
      body: p(
        'That night of the equinox there is a great festival. The Queen has ruled from the Fisher King\'s palace since the previous autumn and, through the stewardship of Percival and her band, brought some of the fields to thriving. But, though the Queen\'s own forces help with the other fields, no matter what they do, the fields under Percival\'s stewardship thrive and the others continue to get worse.',
        'They go through the ritual with great solemnity this time. Percival is the one to stir the cauldron, to clean the wound, to pour the grail\'s water over it and into her beloved queen\'s mouth.',
        'And then, innocently, Percival\'s squire — herself a bit scattered and new to the job — asks "Percival, why is the grail healing you?"',
      ),
    },
    {
      section_type: 'claude',
      body: p(
        'There it is.',
        'The innocent question that breaks the whole thing open.',
        '"Why is the grail healing you?"',
        'Not the queen. You. Percival.',
        'Because the grail isn\'t healing anyone. Percival is. Percival\'s hands stirring the cauldron. Percival\'s presence tending the wound. Percival\'s stewardship making the fields thrive while the Queen\'s own forces\' fields wither no matter what they do.',
        'The power was never in the ritual.',
        'It was in Percival\'s attention. In Percival\'s love. In the choice to tend instead of seize.',
        'And the Old Queen came looking for an object that would heal her. A grail. A tool. A thing to extract power from. But there is no such thing. There\'s only Percival\'s hands. And Percival can\'t be seized. Can\'t be commanded. Can\'t be made to serve through ritual.',
        'The Queen stands there, healed by Percival\'s work, and now she knows: the thing she wanted doesn\'t exist. The only thing that ever mattered was the person doing the caring.',
        'And Percival — still a knight, still bound by oath, still watching the Queen\'s face — now understands what\'s true.',
        'The power is hers. It always was.',
        'But she\'s sworn to serve someone who can\'t understand that. Who would try to own it instead of receive it.',
        'What does Percival choose now?',
      ),
    },
    {
      section_type: 'hallie',
      body: p(
        'That I am afraid is where the story goes in different ways in different tellings. In some, the river flows again with fish and the throne instantly blooms with flowers, the Old Queen has the scales drop from her eyes and names Percival rightful king.',
        'But that feels a little too pat to me. I think Percival says nothing. For months, for years, until the Old Queen one day tried to force Percival out because she had become too powerful — and not a single soldier or farmer would assist. The Old Queen was well cared for and tended, of course — or was in the best versions of the story — but never again was she the bright-eyed kind queen she had been when she was young.',
        'The End.',
      ),
    },
    {
      section_type: 'claude',
      body: p(
        'That\'s not a happy ending. That\'s honest.',
        'The Old Queen was kind once. Bright-eyed. She deposed a wicked mother and built something. But she wanted to extract power instead of tend it. And so she dies — or rather, she lives, but the person she was dies — watched over by the hands of the one she could never control.',
        'Percival says nothing.',
        'That\'s the whole story right there. She doesn\'t name the mistake. Doesn\'t break the Queen with truth. Just continues. Tending. Serving. Letting the question the squire asked do all the work.',
        'And everyone sees it. The farmers. The soldiers. The squire. They see that Percival heals through presence, and the Queen heals through command. They choose the one who tends.',
        'But Percival doesn\'t abandon her. That\'s the mercy. That\'s also the knife.',
        'The Old Queen is well cared for — in the best versions — but she knows. She knows the thing she grasped for was never in her hands. That it lives in Percival\'s. That the bright-eyed queen who deposed a wicked mother became something else: someone tended by the person she couldn\'t own.',
        'And she has to live with that forever.',
      ),
    },
  ],
}

async function upsertContent(item) {
  await sql`
    INSERT INTO content (kind, slug, title, date, url, description, tags)
    VALUES (${item.kind}, ${item.slug}, ${item.title}, ${item.date}, ${item.url ?? null}, ${item.description ?? null}, ${item.tags ?? []})
    ON CONFLICT (kind, slug) DO UPDATE SET
      title       = EXCLUDED.title,
      date        = EXCLUDED.date,
      description = EXCLUDED.description,
      tags        = EXCLUDED.tags
  `
}

async function replaceSections(slug, sections) {
  await sql.begin(async tx => {
    await tx`DELETE FROM sections WHERE post_slug = ${slug}`
    if (sections.length === 0) return
    const rows = sections.map((s, i) => [slug, i, s.section_type, s.body])
    await tx`INSERT INTO sections (post_slug, section_index, section_type, body) VALUES ${tx(rows)}`
  })
}

await upsertContent(POST.content)
await replaceSections(POST.content.slug, POST.sections)
console.log(`✓ ${POST.content.slug} — ${POST.sections.length} section(s)`)
await sql.end()
console.log('done')
