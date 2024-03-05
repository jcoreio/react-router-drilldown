import * as React from 'react'
import {
  HashRouter,
  Route,
  Link,
  withRouter,
  type match,
} from 'react-router-dom'
import Button from '@material-ui/core/Button'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import ChevronRight from '@material-ui/icons/ChevronRight'
import ArrowBack from '@material-ui/icons/ArrowBack'
import withStyles from '@material-ui/core/styles/withStyles'
import Drilldown from '../src'

const styles = (theme) => ({
  root: {
    margin: '0 auto',
  },
  header: {
    maxWidth: 600,
    margin: '16px auto',
  },
  drilldown: {
    [theme.breakpoints.down('xs')]: {
      margin: '0 -100px',
    },
  },
})

const Root = ({ classes }) => (
  <HashRouter>
    <div className={classes.root}>
      <div className={classes.header}>
        <Typography variant="h4">react-router-drilldown demo</Typography>
      </div>
      <Drilldown animateHeight={false} className={classes.drilldown}>
        <Route path="/" exact component={TopView} />
        <Route key={1} path="/characters" exact component={CharactersView} />
        <Route key={2} path="/characters/:id" exact component={CharacterView} />
        <Route key={1} path="/episodes" exact component={EpisodesView} />
      </Drilldown>
    </div>
  </HashRouter>
)

export default withStyles(styles)(Root)

export type BackButtonProps = {
  match: match
}

const backButtonStyles = {
  root: {
    marginLeft: -12,
    marginBottom: 8,
  },
}

const BackButton = withRouter(
  withStyles(backButtonStyles)(
    ({ match, classes }: BackButtonProps): React.Node => {
      const sepIndex = match.url.lastIndexOf('/')
      const to = sepIndex <= 0 ? '/' : match.url.substring(0, sepIndex)
      return (
        <Button classes={classes} to={to} component={Link}>
          <ArrowBack /> Back
        </Button>
      )
    }
  )
)

export type DrilldownListItemProps = {
  children: React.Node
  to: string
}

const DrilldownListItem = ({
  children,
  ...props
}: DrilldownListItemProps): React.Node => (
  <ListItem button component={Link} {...props}>
    <ListItemText>{children}</ListItemText>
    <ListItemSecondaryAction>
      <ChevronRight />
    </ListItemSecondaryAction>
  </ListItem>
)

const viewStyles = (theme) => ({
  root: {
    maxWidth: 600,
    margin: `16px auto`,
    [theme.breakpoints.down('xs')]: {
      padding: '0 100px',
    },
  },
})

export type ViewProps = {
  classes: { [string]: string }
  children: React.Node
}

const View = withStyles(viewStyles)(
  ({ classes, children, ...props }: ViewProps): React.Node => (
    <div className={classes.root} {...props}>
      {children}
    </div>
  )
)

export type TopViewProps = {}

const TopView = (props: TopViewProps): React.Node => (
  <View>
    <Typography variant="h5">The Simpsons</Typography>
    <Paper>
      <List>
        <DrilldownListItem to="/characters">Characters</DrilldownListItem>
        <DrilldownListItem to="/episodes">Episodes</DrilldownListItem>
      </List>
    </Paper>
  </View>
)

const characters = [
  {
    name: 'Homer Simpson',
    role: 'Husband of Marge; father of Bart, Lisa, and Maggie.',
  },
  {
    name: 'Marge Simpson',
    role: 'Wife of Homer; mother of Bart, Lisa, and Maggie.',
  },
  {
    name: 'Bart Simpson',
    role: 'Oldest child and only son of Homer and Marge; brother of Lisa and Maggie.',
  },
  {
    name: 'Lisa Simpson',
    role: 'Middle child and eldest daughter of Homer and Marge; sister of Bart and Maggie.',
  },
  {
    name: 'Maggie Simpson',
    role: 'Youngest child and daughter of Homer and Marge; sister of Bart and Lisa.',
  },
  {
    name: 'Ned Flanders',
    role: `The Simpson family's next door neighbor; owner of The Leftorium (until it closes on Season 29), Bart Simpson's teacher at Springfield Elementary School (Season 29 onwards, substituting the void left by former deceased teacher Edna Krabappel, who was previously married to Flanders from Seasons 23 to 25).`,
  },
  { name: 'Maude Flanders', role: `Ned Flanders's wife (dies on Season 11).` },
  {
    name: 'Charles Montgomery Burns',
    role: 'Owner of the Springfield Nuclear Power Plant.',
  },
  { name: 'Waylon Smithers', role: `Mr. Burns's personal assistant.` },
]

export type CharactersViewProps = {
  match: Match
}

const CharactersView = ({ match }: CharactersViewProps): React.Node => (
  <View>
    <BackButton />
    <Typography variant="h5">Characters</Typography>
    <Paper>
      <List>
        {characters.map(({ name }, key) => (
          <DrilldownListItem key={key} to={`${match.url}/${key}`}>
            {name}
          </DrilldownListItem>
        ))}
      </List>
    </Paper>
  </View>
)

export type CharacterViewProps = {
  match: Match
}

const CharacterView = ({
  match: {
    params: { id },
  },
}: CharacterViewProps): React.Node => {
  const character = characters[parseInt(id)]
  if (!character) {
    return (
      <View>
        <BackButton />
        <Paper>
          <Typography variant="h5">Character not found: {id}</Typography>
        </Paper>
      </View>
    )
  }
  const { name, role } = character
  return (
    <View>
      <BackButton />
      <Card>
        <CardContent>
          <Typography gutterBottom>Character</Typography>
          <Typography variant="h5" component="h2">
            {name}
          </Typography>
          <Typography component="p">{role}</Typography>
        </CardContent>
      </Card>
    </View>
  )
}

const episodes = [
  { title: 'Simpsons Roasting on an Open Fire' },
  { title: 'Bart the Genius' },
  { title: "Homer's Odyssey" },
  { title: "There's No Disgrace Like Home" },
  { title: 'Bart the General' },
  { title: 'Moaning Lisa' },
  { title: 'The Call of the Simpsons' },
  { title: 'The Telltale Head' },
  { title: 'Life on the Fast Lane' },
]

const EpisodesView = (): React.Node => (
  <View>
    <BackButton />
    <Typography variant="h5">Episodes</Typography>
    <Paper>
      <List>
        {episodes.map(({ title }, key) => (
          <ListItem button key={key}>
            <ListItemText>{title}</ListItemText>
          </ListItem>
        ))}
      </List>
    </Paper>
  </View>
)
