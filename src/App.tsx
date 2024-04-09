import { useEffect, useState } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import {
  Container,
  CssBaseline,
  Box,
  Typography,
  MobileStepper,
  Paper,
  Button,
  Grid,
  TextField,
  Modal,
  Fade,
  Backdrop,
} from "@mui/material";
import { KeyboardArrowLeft, KeyboardArrowRight } from "@mui/icons-material";
import Plot from "react-plotly.js";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        html: {
          scrollbarWidth: "thin",
          display: "flex",
          justifyContent: "center",
        },
      },
    },
  },
});

const steps = [
  {
    label: "DOMINANT CHARACTERISTICS",
    options: [
      "The organization is a very personal place. It is like an extended family. People seem to share a lot of themselves.",
      "The organization is a very dynamic and entrepreneurial place. People are willing to stick their necks out and take risks.",
      "The organization is very results oriented. A major concern is with getting the job done. People are very competitive and achievement oriented.",
      "The organization is a very controlled and structured place. Formal procedures generally govern what people do.",
    ],
  },
  {
    label: "ORGANIZATIONAL LEADERSHIP",
    options: [
      "The leadership in the organization is generally considered to exemplify mentoring, facilitating, or nurturing.",
      "The leadership in the organization is generally considered to exemplify entrepreneurship, innovating, or risk taking.",
      "The leadership in the organization is generally considered to exemplify an aggressive, results-oriented, no-nonsense focus.",
      "The leadership in the organization is generally considered to exemplify coordinating, organizing, or smooth-running efficiency.",
    ],
  },
  {
    label: "MANAGEMENT OF EMPLOYEES",
    options: [
      "The management style in the organization is characterized by teamwork, consensus, and participation.",
      "The management style in the organization is characterized by individual risk-taking, innovation, freedom, and uniqueness.",
      "The management style in the organization is characterized by hard-driving competitiveness, high demands, and achievement.",
      "The management style in the organization is characterized by security of employment, conformity, predictability, and stability in relationships.",
    ],
  },
  {
    label: "ORGANIZATIONAL GLUE",
    options: [
      "The glue that holds the organization together is loyalty and mutual trust. Commitment to this organization runs high.",
      "The glue that holds the organization together is commitment to innovation and development. There is an emphasis on being on the cutting edge",
      "The glue that holds the organization together is the emphasis on achievement and goal accomplishment. Aggressiveness and winning are common themes.",
      "The glue that holds the organization together is formal rules and policies. Maintaining a smooth-running organization is important.",
    ],
  },
  {
    label: "STRATEGIC EMPHASES",
    options: [
      "The organization emphasizes human development. High trust, openness, and participation persists.",
      "The organization emphasizes acquiring new resources and creating new challenges. Trying new things and prospecting for opportunities are valued.",
      "The organization emphasizes competitive actions and achievement. Hitting stretch targets and winning in the marketplace are dominant.",
      "The organization emphasizes permanence and stability. Efficiency, control and smooth operations are important.",
    ],
  },
  {
    label: "CRITERIA OF SUCCESS",
    options: [
      "The organization defines success on the basis of the development of human resources, teamwork, employee commitment, and concern for people.",
      "The organization defines success on the basis of having the m ost unique or the newest products.  It is a  product leader and innovator.",
      "The organization defines success on the basis of winning in the marketplace and outpacing the competition. Competitive market leadership is key.",
      "The organization defines success on the basis of efficiency.  Dependable delivery, smooth scheduling, and low cost production are critical.",
    ],
  },
];

const StepOptionItem = ({
  step,
  optionIndex,
  optionValues,
  setOptionValues,
  updateScore,
}: {
  step: number;
  optionIndex: number;
  optionValues: number[][][];
  setOptionValues: Function;
  updateScore: Function;
}) => {
  return (
    <>
      <Grid item xs={1}>{`${String.fromCharCode(
        "A".charCodeAt(0) + optionIndex
      )}`}</Grid>
      <Grid item xs={7}>
        {steps[step].options[optionIndex]}
      </Grid>
      <Grid item xs={2} paddingX={2}>
        <TextField
          key={`${step}${optionIndex}0`}
          size="small"
          type="number"
          required
          fullWidth
          inputProps={{ min: 0, max: 100 }}
          label={`${String.fromCharCode("A".charCodeAt(0) + optionIndex)}`}
          value={
            optionValues.length === 0 ? 0 : optionValues[step][optionIndex][0]
          }
          onChange={(e) => {
            const _optionValues = optionValues;
            _optionValues[step][optionIndex][0] = parseInt(e.target.value);
            setOptionValues([..._optionValues]);
            updateScore("now");
          }}
        />
      </Grid>
      <Grid item xs={2} paddingX={2}>
        <TextField
          key={`${step}${optionIndex}1`}
          size="small"
          type="number"
          required
          fullWidth
          inputProps={{ min: 0, max: 100 }}
          label={`${String.fromCharCode("A".charCodeAt(0) + optionIndex)}`}
          value={
            optionValues.length === 0 ? 0 : optionValues[step][optionIndex][1]
          }
          onChange={(e) => {
            const _optionValues = optionValues;
            _optionValues[step][optionIndex][1] = parseInt(e.target.value);
            setOptionValues([..._optionValues]);
            updateScore("future");
          }}
        />
      </Grid>
    </>
  );
};

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  // width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

function App() {
  const [activeStep, setActiveStep] = useState(0);
  const [scores, setScores] = useState<number[][]>([]);
  const [optionValues, setOptionValues] = useState<number[][][]>([]);
  const [data, setData] = useState<any>([
    {
      type: "scatterpolargl",
      r: [36.67, 23.33, 17.5, 22.5, 36.67],
      theta: [45, 135, 225, 315, 45],
      fill: "toself",
      subplot: "polar4",
      marker: { symbol: "square" },
      hovertemplate: "Now Value: %{r}<br>Axis: %{theta}<extra></extra>",
      name: "Dataset 1",
    },
    {
      type: "scatterpolargl",
      r: [36.67, 20, 17.5, 25.83, 36.67],
      theta: [45, 135, 225, 315, 45],
      fill: "toself",
      subplot: "polar4",
      marker: { symbol: "square" },
      hovertemplate: "Future Value: %{r}<br>Axis: %{theta}<extra></extra>",
      name: "Dataset 2",
    },
  ]);
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  useEffect(() => {
    const _scores = [],
      _optionValues = [];
    for (let i = 0; i < steps.length; ++i) {
      _scores.push([0, 0]);
      let _itemValues = [];
      // for (let j = 0; j < steps[i].options.length; ++j)
      //   _itemValues.push([0, 0]);
      for (let j = 0; j < steps[i].options.length; ++j) {
        _itemValues.push([
          Math.floor(Math.random() * 51),
          Math.floor(Math.random() * 51),
        ]);
      }
      for (let j = 0; j < steps[i].options.length; ++j) {
        _scores[i][0] += _itemValues[j][0];
        _scores[i][1] += _itemValues[j][1];
      }
      _optionValues.push(_itemValues);
    }
    setScores([..._scores]);
    setOptionValues([..._optionValues]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const maxSteps = steps.length;

  const handleNext = () => {
    // if (scores[activeStep][0] !== 100 || scores[activeStep][1] !== 100)
    //   alert("Now and Future total score must be exactly 100");
    // else setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const updateScore = (type: "now" | "future") => {
    let sum = 0;
    for (let i = 0; i < steps[i].options.length; ++i) {
      sum += optionValues[activeStep][i][type === "now" ? 0 : 1];
    }
    if (type === "now") scores[activeStep][0] = sum;
    else scores[activeStep][1] = sum;
    setScores([...scores]);
  };

  return (
    <>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline enableColorScheme />
        <Container
          sx={{
            margin: 4,
            padding: 4,
            backgroundColor: "rgba(31, 38, 46, 0.15)",
          }}
        >
          <Box mb={5}>
            <Typography variant="h3" mb={2}>
              The Competing Values Culture Assessment
            </Typography>
            <Typography>
              These six questions ask you to identify the way you experience
              your organization right now, and, separately, the way you think it
              should be in the future if it is to achieve its highest
              aspirations. In the survey, “the organization” refers to the
              organization managed by your boss (or the organization in which
              you manage, or the organization in which you are working). Please
              rate each of the statements by dividing 100 points between
              alternatives A, B, C, and D depending on how similar the
              description is to your firm. (100 would indicate very similar and
              0 would indicate not at all similar). The total points for each
              question must equal 100. The assessment uses this method to better
              demonstrate how moving toward one profile also requires moving
              away from its opposite. That is, it demonstrates the inherent
              tradeoffs of any approach to culture change. First rate how you
              perceive the organization to be at the present time in the NOW
              column. Second, rate the organization again in the FUTURE column
              depending on how you think your organization must be if it is to
              accomplish its highest objectives and achieve spectacular success.
              You may divide the 100 points in any way among the four
              alternatives in each question. Some alternatives may get zero
              points, for example. Remember that the total must equal 100.
            </Typography>
          </Box>

          {/* <Box component="form" noValidate onSubmit={onSubmitHandler}> */}
          <Box mb={2} display="flex" px={2} gap={2}>
            <TextField
              type="email"
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              label="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Box>
          <Paper
            square
            elevation={0}
            sx={{
              display: "flex",
              alignItems: "center",
              height: 50,
              pl: 2,
              bgcolor: "background.default",
            }}
          >
            <Typography>
              {activeStep + 1}. {steps[activeStep].label}
            </Typography>
          </Paper>
          <Box sx={{ p: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={1}></Grid>
              <Grid item xs={7}></Grid>
              <Grid item xs={2}>
                Now
              </Grid>
              <Grid item xs={2}>
                Future
              </Grid>
              {steps[activeStep].options.map((_, index) => (
                <StepOptionItem
                  step={activeStep}
                  optionIndex={index}
                  optionValues={optionValues}
                  setOptionValues={setOptionValues}
                  updateScore={updateScore}
                  key={`step_${activeStep}_option_${index}`}
                />
              ))}
              <Grid item xs={8} sx={{ textAlign: "end", px: 2 }}>
                Total
              </Grid>
              <Grid item xs={2} sx={{ textAlign: "end", px: 2 }}>
                {scores.length === 0 ? 0 : scores[activeStep][0]}
              </Grid>
              <Grid item xs={2} sx={{ textAlign: "end", px: 2 }}>
                {scores.length === 0 ? 0 : scores[activeStep][1]}
              </Grid>
            </Grid>
          </Box>
          <MobileStepper
            variant="text"
            steps={maxSteps}
            position="static"
            activeStep={activeStep}
            nextButton={
              <Button
                size="small"
                onClick={handleNext}
                disabled={activeStep === maxSteps - 1}
              >
                Next
                <KeyboardArrowRight />
              </Button>
            }
            backButton={
              <Button
                size="small"
                onClick={handleBack}
                disabled={activeStep === 0}
              >
                <KeyboardArrowLeft />
                Back
              </Button>
            }
          />
          <Button
            sx={{ mt: 2 }}
            disabled={activeStep === 5 ? false : true}
            onClick={() => {
              if (email === "" || name === "") {
                alert("Email and Name must be filled!");
                return;
              }
              handleOpen();
              let avg = [
                [0, 0, 0, 0],
                [0, 0, 0, 0],
              ];
              for (let i = 0; i < scores.length; ++i) {
                for (let j = 0; j < 4; ++j) {
                  avg[0][j] += optionValues[i][j][0];
                  avg[1][j] += optionValues[i][j][1];
                }
              }

              data[0].r = [
                avg[0][0] / 6,
                avg[0][1] / 6,
                avg[0][2] / 6,
                avg[0][3] / 6,
              ];
              data[1].r = [
                avg[1][0] / 6,
                avg[1][1] / 6,
                avg[1][2] / 6,
                avg[1][3] / 6,
              ];
              setData([...data]);
            }}
          >
            Submit
          </Button>
          {/* </Box> */}
        </Container>
        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          open={open}
          onClose={handleClose}
          closeAfterTransition
          slots={{ backdrop: Backdrop }}
          slotProps={{
            backdrop: {
              timeout: 500,
            },
          }}
        >
          <Fade in={open}>
            <Box sx={style}>
              <Typography>Email: {email}</Typography>
              <Typography mb={1}>Name: {name}</Typography>
              <Box>
                <Plot
                  data={data}
                  layout={{
                    width: 1200,
                    height: 600,
                    polar4: {
                      domain: {
                        x: [0, 1],
                        y: [0, 1],
                      },
                      radialaxis: {
                        visible: true,
                        range: [0, 50],
                      },
                      angularaxis: {
                        tickvals: [45, 135, 225, 315],
                        ticktext: [
                          "Create",
                          "Collaborate",
                          "Control",
                          "Compete",
                        ],
                        tickfont: {
                          size: 36,
                          color: "red",
                          family: "Courier New, monospace",
                        },
                      },
                    },
                    legend: {
                      x: 1,
                      y: 1,
                    },
                    showlegend: false,
                    shapes: [
                      {
                        type: "line",
                        x0: 0.5,
                        y0: 0,
                        x1: 0.5,
                        y1: 1,
                        line: {
                          color: "black",
                          width: 1,
                        },
                      },
                      {
                        type: "line",
                        x0: 0.25,
                        y0: 0.5,
                        x1: 0.75,
                        y1: 0.5,
                        line: {
                          color: "black",
                          width: 1,
                        },
                      },
                    ],
                  }}
                />
              </Box>
            </Box>
          </Fade>
        </Modal>
      </ThemeProvider>
    </>
  );
}

export default App;
