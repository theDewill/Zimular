import matplotlib.pyplot as plt


def stairs_plot(data, chart_title):
    # Unpack the data into separate arrays for x and y
    x, y = zip(*data)

    # Create a stairs plot
    plt.step(x, y, where='mid', label='Stairs Plot')

    # Add labels and title
    plt.xlabel('X-axis')
    plt.ylabel('Y-axis')
    plt.title(chart_title)

    # Add grid and legend
    plt.grid(True)
    plt.legend()

    # Show the plot
    plt.show()